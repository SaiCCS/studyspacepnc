# PnCStudySync

## Netlify setup

1. Netlify Identity is enabled for the site. The login page supports email/password sign-in, account creation, password reset, email confirmation, and invite acceptance; configure registration and email confirmation in Identity settings.
2. Ensure the site is on a plan that supports Netlify Database, then deploy this repository. Netlify provisions its built-in Database and applies `netlify/database/migrations/` during deploys.
3. For local development, run `npm install` and `npm run dev`. The build writes the static site to `dist/`, which is the only folder Netlify publishes. Netlify CLI provides local Functions and Database; Identity login flows require a deployed site or Deploy Preview.

Study data is stored per authenticated Identity user in Netlify Database. The app does not load example courses, tasks, or a sample profile.
