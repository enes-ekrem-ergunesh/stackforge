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

Optional host-run development mode:

```bash
cd backend && npm install && npm run start:dev
cd frontend && npm install && npm run start
```

You can keep PostgreSQL in Docker while running app servers on host:

```bash
docker compose up -d db
```

## Production notes

- Configure real domain + TLS in `nginx/nginx.conf` (mount certs into `certs` volume).
- Keep `.env` untracked and rotate any previously exposed credentials.
- Prefer Docker secrets or an external secret manager for database credentials.
