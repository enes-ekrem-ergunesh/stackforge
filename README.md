# stackforge

Production-ready Docker Compose template for a reusable full-stack platform.

## Recommended folder structure

```
.
├── backend/          # NestJS API (Swagger/OpenAPI from decorators)
├── frontend/         # Angular + Angular Material PWA
├── nginx/            # Reverse proxy config (nginx.conf)
├── docker-compose.yml
└── .env.example
```

## Services overview

- **nginx**: Public entrypoint (ports 80/443). Routes `/` → frontend, `/api` → backend, `/docs` → Swagger.
- **backend**: NestJS API, connects to PostgreSQL via service name `db`. Optional host port exposure.
- **frontend**: Angular PWA build, optional host port exposure for dev.
- **db**: PostgreSQL with persistent `db_data` volume and optional host port exposure.
- **backup**: Periodic PostgreSQL dumps to `backup_data` volume.
- **restore**: Manual restore helper; attach and run `psql`/`pg_restore` against dumps.

Networks:
- `public`: nginx only (public ingress).
- `internal`: backend, frontend, db, backup, restore, and nginx for service-to-service traffic.

Volumes:
- `db_data` for PostgreSQL data
- `certs` for TLS material (mounted into nginx)
- `backup_data` for dumps

## Usage

1. Copy `.env.example` to `.env` and adjust secrets/ports.
2. Place your NestJS app in `backend/` and Angular PWA in `frontend/`.
3. Update `nginx/nginx.conf` if you need custom domains or TLS paths.
4. Start the stack:

```bash
docker compose up -d --build
```

Healthchecks and `depends_on` ensure services start in order. Backend and database ports can be exposed for local development via `.env`. Backups run periodically with optional `BACKUP_RETENTION_DAYS`; use the `restore` service to apply dumps from `backup_data`. NGINX listens on 80 (HTTP→HTTPS redirect) and 443 (requires certs in `certs` volume).
