import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ========== Web Push Protocol Implementation ==========

function base64UrlDecode(str: string): Uint8Array {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(base64 + padding);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function concatUint8Arrays(...arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

async function createVapidAuthHeader(
  audience: string,
  subject: string,
  publicKey: Uint8Array,
  privateKey: Uint8Array
): Promise<{ authorization: string; cryptoKey: string }> {
  // Create JWT
  const header = { typ: "JWT", alg: "ES256" };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    aud: audience,
    exp: now + 12 * 60 * 60,
    sub: subject,
  };

  const encoder = new TextEncoder();
  const headerB64 = base64UrlEncode(encoder.encode(JSON.stringify(header)));
  const payloadB64 = base64UrlEncode(encoder.encode(JSON.stringify(payload)));
  const unsignedToken = `${headerB64}.${payloadB64}`;

  // Import private key via JWK (more reliable than manual PKCS8 DER)
  const x = publicKey.slice(1, 33);
  const y = publicKey.slice(33, 65);
  const jwk = {
    kty: "EC",
    crv: "P-256",
    x: base64UrlEncode(x),
    y: base64UrlEncode(y),
    d: base64UrlEncode(privateKey),
  };

  const signingKey = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    signingKey,
    encoder.encode(unsignedToken)
  );

  // Convert DER signature to raw r||s format
  const sigBytes = new Uint8Array(signature);
  let r: Uint8Array, s: Uint8Array;

  if (sigBytes[0] === 0x30) {
    // DER encoded
    let offset = 2;
    const rLen = sigBytes[offset + 1];
    r = sigBytes.slice(offset + 2, offset + 2 + rLen);
    offset = offset + 2 + rLen;
    const sLen = sigBytes[offset + 1];
    s = sigBytes.slice(offset + 2, offset + 2 + sLen);

    // Remove leading zeros
    if (r.length > 32) r = r.slice(r.length - 32);
    if (s.length > 32) s = s.slice(s.length - 32);

    // Pad if needed
    if (r.length < 32) {
      const padded = new Uint8Array(32);
      padded.set(r, 32 - r.length);
      r = padded;
    }
    if (s.length < 32) {
      const padded = new Uint8Array(32);
      padded.set(s, 32 - s.length);
      s = padded;
    }

    const rawSig = concatUint8Arrays(r, s);
    const jwt = `${unsignedToken}.${base64UrlEncode(rawSig)}`;
    return {
      authorization: `vapid t=${jwt}, k=${base64UrlEncode(publicKey)}`,
      cryptoKey: `p256ecdsa=${base64UrlEncode(publicKey)}`,
    };
  } else {
    // Already raw format (64 bytes)
    const jwt = `${unsignedToken}.${base64UrlEncode(sigBytes)}`;
    return {
      authorization: `vapid t=${jwt}, k=${base64UrlEncode(publicKey)}`,
      cryptoKey: `p256ecdsa=${base64UrlEncode(publicKey)}`,
    };
  }
}

async function hkdf(
  salt: Uint8Array,
  ikm: Uint8Array,
  info: Uint8Array,
  length: number
): Promise<Uint8Array> {
  // RFC 5869: HKDF-Extract(salt, IKM) = HMAC-Hash(salt, IKM) — salt is the key, IKM is the data
  const saltData = salt.length > 0 ? salt.buffer as ArrayBuffer : new Uint8Array(32).buffer as ArrayBuffer;
  const saltKey = await crypto.subtle.importKey("raw", saltData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const prk = new Uint8Array(await crypto.subtle.sign("HMAC", saltKey, ikm.buffer as ArrayBuffer));

  const prkKey = await crypto.subtle.importKey("raw", prk, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const infoWithCounter = concatUint8Arrays(info, new Uint8Array([1]));
  const okm = new Uint8Array(await crypto.subtle.sign("HMAC", prkKey, infoWithCounter));
  return okm.slice(0, length);
}

function createInfo(type: string, clientPublicKey: Uint8Array, serverPublicKey: Uint8Array): Uint8Array {
  const encoder = new TextEncoder();
  const typeBytes = encoder.encode(type);
  const nul = new Uint8Array([0]);

  // "Content-Encoding: " + type + "\0" + "P-256" + "\0" +
  // len(clientPublicKey) + clientPublicKey + len(serverPublicKey) + serverPublicKey
  const header = encoder.encode("Content-Encoding: ");
  const p256 = encoder.encode("P-256");

  const clientLen = new Uint8Array(2);
  clientLen[0] = 0;
  clientLen[1] = clientPublicKey.length;

  const serverLen = new Uint8Array(2);
  serverLen[0] = 0;
  serverLen[1] = serverPublicKey.length;

  return concatUint8Arrays(
    header, typeBytes, nul, p256, nul,
    clientLen, clientPublicKey,
    serverLen, serverPublicKey
  );
}

async function encryptPayload(
  clientPublicKeyB64: string,
  clientAuthB64: string,
  payload: string
): Promise<{ ciphertext: Uint8Array; salt: Uint8Array; serverPublicKey: Uint8Array }> {
  const clientPublicKey = base64UrlDecode(clientPublicKeyB64);
  const clientAuth = base64UrlDecode(clientAuthB64);
  const encoder = new TextEncoder();
  const payloadBytes = encoder.encode(payload);

  // Generate server ECDH key pair
  const serverKeys = await crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveBits"]
  );

  const serverPublicKeyRaw = new Uint8Array(
    await crypto.subtle.exportKey("raw", serverKeys.publicKey)
  );

  // Import client public key
  const clientKey = await crypto.subtle.importKey(
    "raw",
    clientPublicKey,
    { name: "ECDH", namedCurve: "P-256" },
    false,
    []
  );

  // ECDH shared secret
  const sharedSecret = new Uint8Array(
    await crypto.subtle.deriveBits(
      { name: "ECDH", public: clientKey },
      serverKeys.privateKey,
      256
    )
  );

  // Generate salt
  const salt = crypto.getRandomValues(new Uint8Array(16));

  // HKDF for auth info
  const authInfo = encoder.encode("Content-Encoding: auth\0");
  const prk = await hkdf(clientAuth, sharedSecret, authInfo, 32);

  // Content encryption key
  const cekInfo = createInfo("aesgcm", clientPublicKey, serverPublicKeyRaw);
  const contentEncryptionKey = await hkdf(salt, prk, cekInfo, 16);

  // Nonce
  const nonceInfo = createInfo("nonce", clientPublicKey, serverPublicKeyRaw);
  const nonce = await hkdf(salt, prk, nonceInfo, 12);

  // Pad payload (2 bytes padding length + payload)
  const paddingLength = 0;
  const paddedPayload = new Uint8Array(2 + paddingLength + payloadBytes.length);
  paddedPayload[0] = (paddingLength >> 8) & 0xff;
  paddedPayload[1] = paddingLength & 0xff;
  paddedPayload.set(payloadBytes, 2 + paddingLength);

  // AES-128-GCM encrypt
  const aesKey = await crypto.subtle.importKey(
    "raw",
    contentEncryptionKey,
    "AES-GCM",
    false,
    ["encrypt"]
  );

  const encrypted = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: nonce },
      aesKey,
      paddedPayload
    )
  );

  return { ciphertext: encrypted, salt, serverPublicKey: serverPublicKeyRaw };
}

async function sendPushToEndpoint(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payload: string,
  vapidPublicKey: Uint8Array,
  vapidPrivateKey: Uint8Array,
  vapidSubject: string
): Promise<Response> {
  const url = new URL(subscription.endpoint);
  const audience = `${url.protocol}//${url.host}`;

  const vapidHeaders = await createVapidAuthHeader(
    audience,
    vapidSubject,
    vapidPublicKey,
    vapidPrivateKey
  );

  const { ciphertext, salt, serverPublicKey } = await encryptPayload(
    subscription.p256dh,
    subscription.auth,
    payload
  );

  return fetch(subscription.endpoint, {
    method: "POST",
    headers: {
      Authorization: vapidHeaders.authorization,
      "Crypto-Key": vapidHeaders.cryptoKey + `;dh=${base64UrlEncode(serverPublicKey)}`,
      "Content-Encoding": "aesgcm",
      Encryption: `salt=${base64UrlEncode(salt)}`,
      "Content-Type": "application/octet-stream",
      TTL: "86400",
      Urgency: "high",
    },
    body: ciphertext,
  });
}

// ========== Main Handler ==========

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const vapidPublicKeyB64 = Deno.env.get("VAPID_PUBLIC_KEY")!;
    const vapidPrivateKeyB64 = Deno.env.get("VAPID_PRIVATE_KEY")!;
    const vapidSubject = Deno.env.get("VAPID_SUBJECT") || "mailto:admin@goruslugimsk.ru";

    const vapidPublicKey = base64UrlDecode(vapidPublicKeyB64);
    const vapidPrivateKey = base64UrlDecode(vapidPrivateKeyB64);

    const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();

    // Check if this is a test push from admin
    if (body.test === true) {
      // Verify admin
      const authHeader = req.headers.get("Authorization");
      if (authHeader) {
        const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
          global: { headers: { Authorization: authHeader } },
        });
        const { error } = await userClient.rpc("verify_admin_access");
        if (error) {
          return new Response(JSON.stringify({ error: "Access denied" }), {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
    }

    // Build notification payload
    let notificationPayload: { title: string; body: string; leadId?: string; url?: string };

    if (body.test) {
      notificationPayload = {
        title: "🔔 Тестовое уведомление",
        body: "Push-уведомления работают корректно!",
        url: "/admin/",
      };
    } else {
      // Real lead from trigger
      const lead = body.record || body;
      const phone = lead.phone || "Без номера";
      const source = lead.source || "сайт";
      const time = new Date().toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Moscow",
      });

      notificationPayload = {
        title: "🔔 Новая заявка!",
        body: `${phone} — ${source} — ${time}`,
        leadId: lead.id,
        url: "/admin/",
      };
    }

    // Get all subscriptions
    const { data: subscriptions, error: subError } = await serviceClient
      .from("push_subscriptions")
      .select("*");

    if (subError || !subscriptions?.length) {
      console.log("No subscriptions found:", subError?.message || "empty");
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: "No subscriptions" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const payloadStr = JSON.stringify(notificationPayload);
    let sent = 0;
    const expired: string[] = [];

    // Send to all subscriptions
    for (const sub of subscriptions) {
      try {
        const response = await sendPushToEndpoint(
          { endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth },
          payloadStr,
          vapidPublicKey,
          vapidPrivateKey,
          vapidSubject
        );

        if (response.status === 201 || response.status === 200) {
          sent++;
          // Update last_used
          await serviceClient
            .from("push_subscriptions")
            .update({ last_used: new Date().toISOString() })
            .eq("id", sub.id);
        } else if (response.status === 410 || response.status === 404) {
          // Subscription expired
          expired.push(sub.id);
        } else {
          const text = await response.text();
          console.error(`Push failed for ${sub.endpoint}: ${response.status} ${text}`);
        }
      } catch (err) {
        console.error(`Push error for ${sub.endpoint}:`, err);
      }
    }

    // Clean up expired subscriptions
    if (expired.length > 0) {
      await serviceClient
        .from("push_subscriptions")
        .delete()
        .in("id", expired);
      console.log(`Cleaned up ${expired.length} expired subscriptions`);
    }

    console.log(`✅ Push sent to ${sent}/${subscriptions.length} subscriptions`);

    return new Response(
      JSON.stringify({ success: true, sent, total: subscriptions.length, expired: expired.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Send push error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
