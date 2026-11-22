# Environment Setup

Keep credentials out of source files, scripts, and documentation. Use an ignored local `.env` file for development and the service's Environment settings for deployment.

## Backend

Create `backend/.env` for local development:

```env
MONGODB_URI=<your-local-or-Atlas-connection-string>
JWT_SECRET=<a-long-random-secret>
ADMIN_PASSWORD=<a-unique-random-password-at-least-16-characters>
FRONTEND_URL=http://localhost:3000
```

The `.env` file is ignored by Git. Do not copy real values into this guide or into setup scripts.

## Render

On the backend Web Service, configure `MONGODB_URI`, `JWT_SECRET`, `ADMIN_PASSWORD`, and `FRONTEND_URL`. Render supplies `PORT`; do not hard-code it.

On the frontend Static Site, configure `REACT_APP_API_URL` as the backend's public URL ending in `/api`. This variable is embedded when the static site is built, so redeploy after changing it. See [DEPLOYMENT.md](./DEPLOYMENT.md) for the service setup.

The former environment setup scripts contained credentials and have been removed. Rotate any credentials that were previously stored in those scripts or in older revisions of this repository.
