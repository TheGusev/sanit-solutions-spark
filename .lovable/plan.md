## Add concurrency control to docker-build workflow

Add a `concurrency` block to `.github/workflows/docker-build.yml` so that when a new build starts, any in-progress build for the same workflow is automatically cancelled. This prevents queue buildup and stale builds blocking new commits.

### Change

In `.github/workflows/docker-build.yml`, insert these 3 lines immediately after the `on:` block (before `env:`):

```yaml
concurrency:
  group: docker-build
  cancel-in-progress: true
```

### Resulting top of file

```yaml
name: Build and Push Docker Image
on:
  push:
    branches:
      - main
  workflow_dispatch:

concurrency:
  group: docker-build
  cancel-in-progress: true

env:
  IMAGE_NAME: thegusev/sanit-solutions
jobs:
  ...
```

### Scope

- Only `.github/workflows/docker-build.yml` is modified.
- No other files touched. No logic, jobs, steps, or env changed.
