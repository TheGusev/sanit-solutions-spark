

# Fix: Auto-deploy pipeline and React types

## Root Cause

The GitHub Actions workflow (`docker-build.yml`) builds and pushes the Docker image to Docker Hub, but **has no step to trigger a redeploy on your Dokploy server**. The image sits on Docker Hub with new code, but your production server keeps running the old container.

## Changes

### 1. Add Dokploy redeploy step to GitHub Actions

Add a final step to `.github/workflows/docker-build.yml` that calls Dokploy's API to trigger a redeploy after the image is pushed:

```yaml
- name: Trigger Dokploy Redeploy
  run: |
    curl -X POST "https://${{ secrets.DOKPLOY_DOMAIN }}/api/application.redeploy" \
      -H "Authorization: Bearer ${{ secrets.DOKPLOY_API_TOKEN }}" \
      -H "Content-Type: application/json" \
      -d '{"appName": "${{ secrets.DOKPLOY_APP_ID }}"}'
```

This requires 3 GitHub Secrets to be configured in the repository:
- `DOKPLOY_DOMAIN` -- your Dokploy panel domain (e.g., `panel.yourdomain.com`)
- `DOKPLOY_API_TOKEN` -- API token from Dokploy settings
- `DOKPLOY_APP_ID` -- application ID in Dokploy (e.g., `service-goruslugimsk-6jrp9b` or the app name)

### 2. Fix React types mismatch

Update `@types/react` from `^18.3.23` to `^19.0.0` and `@types/react-dom` from `^18.3.7` to `^19.0.0` in `package.json` devDependencies to match the installed `react@^19.2.4`.

## What you need to do on your side

Before publishing, make sure these 3 secrets exist in your GitHub repository (Settings > Secrets and variables > Actions):
1. `DOKPLOY_DOMAIN`
2. `DOKPLOY_API_TOKEN`
3. `DOKPLOY_APP_ID`

If you don't have them yet, go to your Dokploy panel, find the API token in Settings, and note the application name/ID for the goruslugimsk app.

## Technical Details

- The Dokploy API endpoint for redeploying is typically `POST /api/application.redeploy`
- The request body needs the `appName` field matching your Dokploy application identifier
- The workflow will wait for the Docker push to complete before triggering the redeploy
- React 19 types will prevent potential CI build failures from type mismatches

