

## Plan: Full Rewrite of Monitoring System

### Problem
Current `monitor.py` is stripped down — no SSL check, no Telegram sending, no content/indexation/PageSpeed/tasks sections, incomplete `update_monitoring_md`. The MONITORING.md is also minimal. The workflow is fine but the script it runs does almost nothing useful.

### Changes

#### 1. `scripts/monitor.py` — Full rewrite
Replace entirely with the expanded script that includes all sections:

- **URL health checks** with average response time
- **SSL certificate check** with expiry warning (< 30 days)
- **Content stats** (547 SSG pages breakdown: blog, districts, MO cities, services, NCH)
- **Indexation** (Yandex 419, Google 23, target 500+ with progress bar)
- **PageSpeed** (Desktop 95, Mobile 88, LCP, CLS, target Mobile 95+)
- **Yandex Metrika traffic** (30-day: visits, users, views, bounce, duration) with fallback if no token
- **Tasks March 2026** (8 items with checkboxes)
- **Tasks March-April 2026** (8 next-stage items)
- **Alerts** block for failed URLs and SSL warnings
- **Telegram sending** with HTML parse_mode, chunked for 4000-char limit
- **MONITORING.md auto-update** — rewrites the file completely each run with all sections as markdown tables
- Footer with clickable links to MONITORING.md and Actions

#### 2. `MONITORING.md` — Full rewrite
Expand to include all sections matching the Telegram report:

- Table of Contents
- Indexation (Yandex/Google tables with KPI target)
- Search positions (manual keyword tracking table)
- Traffic & Audience (Metrika monthly table)
- Conversions & Funnel (leads, CR, sources table)
- PageSpeed technical metrics
- Competitors table
- Content & Structure breakdown
- External factors (SSL, robots.txt, sitemap, verifications)
- Alerts & Problems log
- Tasks March 2026 (checkboxes)
- Tasks March-April 2026 (next stage)
- Results tracking

#### 3. `.github/workflows/monitoring.yml` — Minor fix
- Add `permissions: contents: write` so the bot can push commits
- Keep `beautifulsoup4` in pip install (harmless, may be used later)

### Summary
Three files changed. Script goes from ~96 lines to ~300 lines with full monitoring. MONITORING.md goes from 46 lines to a comprehensive dashboard. Workflow gets write permissions fix.

