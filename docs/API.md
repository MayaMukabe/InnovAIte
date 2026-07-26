# API contract

Local base URL: `http://localhost:8787`.

JSON requests are validated with Zod. Unknown resources return `404`; malformed payloads return `400`; unexpected errors return a generic `500`.

## Health

`GET /api/health`

Returns service identity and API version.

## Profiles

- `GET /api/profile/:id` returns a profile or `null`.
- `PUT /api/profile/:id` replaces a validated profile containing XP, district levels, activity/evidence statistics, and comic unlocks.

The current `demo` ID is not authentication. Replace it with authenticated and authorized learner IDs before public deployment.

## Reviewed district questions

- `GET /api/questions/district/:district` returns safe content without answer indexes.
- `POST /api/questions/district/:district/check` accepts `questionId` and `answer`, then returns correctness and process guidance.

## Materials

`POST /api/materials`

Multipart field: `material`. Accepted MIME types are `text/plain`, `text/markdown`, and `application/pdf`; maximum size is 5 MB.

`GET /api/materials`

Returns persisted safe study sets.

`POST /api/materials/:id/check`

Accepts `questionId` and `answer`. Returns correctness and the supporting source sentence.
