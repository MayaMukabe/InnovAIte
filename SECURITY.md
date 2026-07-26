# Security policy

## Supported versions

Only the latest commit on `main` is supported.

## Reporting

Do not open a public issue for a vulnerability or exposed student data. Contact the repository owner privately through the GitHub profile and include reproduction steps, impact, and affected versions.

## Student-data notice

This prototype is not approved for real student data. It syncs progress to a local file-backed API and caches it in `localStorage`.

Uploads are limited to one 5 MB TXT, Markdown, or PDF file, held in memory during extraction, and not written raw to disk. Extracted excerpts are persisted in generated study sets.

Before public or classroom deployment, add authenticated roles, tenant isolation, rate limiting, malware scanning, parser sandboxing, encrypted managed storage, retention/deletion jobs, audit logs, backups, secret management, and a COPPA/FERPA privacy review.

## Dependency maintenance

Run:

```bash
npm audit
npm run lint
npm run test
npm run build
npm run build:server
```

Review lockfile changes and apply security updates promptly.
