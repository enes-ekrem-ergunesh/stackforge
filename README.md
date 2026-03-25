# stackforge

Production-ready full-stack template with initialized NestJS backend + Angular frontend, wired for both coding and deployment.

## Included projects

```
.
├── backend/          # NestJS project (source + config files)
├── frontend/         # Angular project (source + config files)
├── nginx/            # Reverse proxy config (nginx.conf)
├── docker-compose.yml
└── .env.example
```

No generated runtime artifacts are committed (`node_modules`, build output, cert files, etc.).

## Pinned versions

- Node.js: `22.14.0` (Docker + `.nvmrc`)
- NestJS packages: pinned exact versions in `backend/package.json`
- Angular packages: pinned exact versions in `frontend/package.json`
- PostgreSQL image: `16.8-alpine`
- NGINX image: `1.26.3-alpine`

## Service topology

- `nginx`: public ingress (`80`/`443` host ports configurable via `.env`)
- `backend`: NestJS API on container `3000`, local host bind `127.0.0.1:${BACKEND_HOST_PORT}`
- `frontend`: Angular static app on container `4200`, local host bind `127.0.0.1:${FRONTEND_HOST_PORT}`
- `db`: PostgreSQL on container `5432`, local host bind `127.0.0.1:${POSTGRES_HOST_PORT}`
- `backup` + `restore`: DB backup/restore helpers

Networks:
- `public`: nginx ingress
- `internal`: service-to-service traffic

Volumes:
- `db_data`, `certs`, `backup_data`

## Quick start

1. Copy env template and set secrets/ports:

```bash
cp .env.example .env
```

2. Start the stack:

```bash
docker compose up -d --build
```

3. Open endpoints:

- NGINX: `http://localhost:${NGINX_HTTP_PORT}`
- Backend API: `http://127.0.0.1:${BACKEND_HOST_PORT}/api`
- Swagger: `http://127.0.0.1:${BACKEND_HOST_PORT}/docs`
- Frontend: `http://127.0.0.1:${FRONTEND_HOST_PORT}`

If port `80`/`443` is occupied locally, set `NGINX_HTTP_PORT` / `NGINX_HTTPS_PORT` (for example `8080` / `8443`).

## Local coding workflow

Edit source files directly:
- Backend: `backend/src/*`
- Frontend: `frontend/src/*`

### Option 1: Live reload (with Docker) — recommended for development

The `docker-compose.override.yml` file automatically enables live reload for both backend and frontend:

```bash
docker compose up -d
```

- **Backend**: `npm run start:dev` watches `backend/src/*` for changes; reload on save via NestJS hot-reload.
- **Frontend**: `ng serve` watches `frontend/src/*` for changes; reload on save via Angular's dev server.

Both are accessible on `127.0.0.1:${BACKEND_HOST_PORT}` and `127.0.0.1:${FRONTEND_HOST_PORT}` respectively.

### Option 2: Host-run development mode (manual)

```bash
cd backend && npm install && npm run start:dev
cd frontend && npm install && npm run start
```

You can keep PostgreSQL in Docker while running app servers on host:

```bash
docker compose up -d db
```

## Database backup and restore

The stack includes automated PostgreSQL backups and a restore helper.

### Automatic backups

Backups run on schedule via the `backup` service:
- Backup interval: `${BACKUP_INTERVAL_SECONDS}` (default 86400 seconds = 1 day)
- Retention: `${BACKUP_RETENTION_DAYS}` (default 7 days; older files auto-delete)
- Location: `backup_data` volume (inside container at `/backups`)

Customize in `.env`:

```bash
BACKUP_INTERVAL_SECONDS=43200  # Backup every 12 hours
BACKUP_RETENTION_DAYS=14       # Keep 14 days of backups
```

### Manual restore from backup

1. List available backups:

```bash
docker compose exec restore ls -la /backups
```

2. Restore a specific backup:

```bash
docker compose exec restore pg_restore -h db -U ${POSTGRES_USER} -d ${POSTGRES_DB} -v /backups/backup-2026-03-25T10:00:00Z.sql.gz
```

3. Or restore from plain SQL dump:

```bash
docker compose exec restore psql -h db -U ${POSTGRES_USER} -d ${POSTGRES_DB} -f /backups/backup-2026-03-25T10:00:00Z.sql
```

### Export backup to local machine

```bash
docker compose cp restore:/backups/backup-2026-03-25T10:00:00Z.sql.gz ./
```

## Production notes

- **Important**: Remove `docker-compose.override.yml` before production deployment (or exclude it from CI/CD). This file enables dev-only live reload and must not be used in production.
- Configure real domain + TLS in `nginx/nginx.conf` (mount certs into `certs` volume).
- Keep `.env` untracked and rotate any previously exposed credentials.
- Prefer Docker secrets or an external secret manager for database credentials.
- Backups are stored in `backup_data` volume; ensure this volume is backed up by your infrastructure (external storage, S3, etc.).
