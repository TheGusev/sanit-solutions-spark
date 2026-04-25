# SSG is built on GitHub Actions runner (npm run build),
# dist/ is copied here — no Node, no npm, no multi-stage hang.
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Copy pre-built static files from runner
COPY dist/ .

# Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Entrypoint for runtime env injection (if any)
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
