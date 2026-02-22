import { Helmet } from "react-helmet-async";
import { cn } from "@/lib/utils";
import { SEO_CONFIG } from "@/lib/seo";

interface AuthorBadgeProps {
  name: string;
  role: string;
  experience: string;
  avatarUrl?: string;
  className?: string;
}

const AuthorBadge = ({ name, role, experience, avatarUrl, className }: AuthorBadgeProps) => {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  const personLD = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle: role,
    description: experience,
    worksFor: {
      "@type": "Organization",
      name: SEO_CONFIG.companyName,
      url: SEO_CONFIG.baseUrl,
    },
  };

  return (
    <div className={cn("my-4 mx-auto max-w-3xl flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border", className)}>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(personLD)}</script>
      </Helmet>

      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className="w-11 h-11 rounded-full object-cover shrink-0"
        />
      ) : (
        <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
          {initials}
        </div>
      )}

      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground leading-tight">{name}</p>
        <p className="text-xs text-muted-foreground">{role} · {experience}</p>
      </div>
    </div>
  );
};

export default AuthorBadge;
