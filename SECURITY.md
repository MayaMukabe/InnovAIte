# Security policy

## Supported versions

The latest commit on `main` is the only supported prototype version.

## Reporting

Do not open a public issue for a suspected vulnerability or exposed student data. Contact the repository owner privately through the GitHub profile associated with this repository and include reproduction steps, impact, and affected versions.

## Student-data notice

This prototype is not approved to collect student data. It stores XP, Brain City district levels, and aggregate evidence totals in browser `localStorage`. Optional report export excludes selected answers and reflection text. Do not deploy it with authentication, uploads, analytics, or server persistence until a formal threat model, privacy review, COPPA/FERPA assessment, access-control design, retention policy, and incident-response plan are complete.

## Dependency maintenance

Run `npm audit`, `npm run lint`, and `npm run build` before releases. Review lockfile changes and apply security updates promptly.
