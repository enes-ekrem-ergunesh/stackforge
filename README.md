# stackforge

Production-ready Docker Compose template for a reusable full-stack platform.

## Recommended folder structure

```
.
├── backend/          # Minimal API stub (replace with NestJS app)
├── frontend/         # Minimal frontend stub (replace with Angular PWA)
├── nginx/            # Reverse proxy config (nginx.conf)
├── docker-compose.yml
└── .env.example
```

## Services overview

- **nginx**: Public entrypoint (ports 80/443). Local/dev runs over HTTP on port 80; routes `/` → frontend, `/api` → backend, `/docs` → backend docs.
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
2. Replace the stub apps in `backend/` and `frontend/` with your NestJS and Angular projects when ready.
3. Update `nginx/nginx.conf` for your domain and TLS settings before production deployment.
4. Start the stack:

```bash
docker compose up -d --build
```

Healthchecks and `depends_on` ensure services start in order. Backups run periodically with optional `BACKUP_RETENTION_DAYS`; use the `restore` service to apply dumps from `backup_data`. Local/dev NGINX serves over HTTP on port 80 by default. For production, add HTTPS termination on 443 with certs mounted in `certs` volume.

If ports `80` or `443` are already in use locally, set `NGINX_HTTP_PORT` and `NGINX_HTTPS_PORT` in `.env` (for example `8080` and `8443`).

**Production hardening**
- Prefer Docker secrets or an external secret manager for database credentials and other secrets.
- Remove host `ports` mappings for backend/frontend/database so only NGINX is publicly reachable; services still communicate over the `internal` network.
- Ensure `.env` is not committed and rotate any previously committed credentials.

**Local development override (example)**

Create a `docker-compose.override.yml` to expose ports only on your workstation:

```yaml
services:
  backend:
    ports:
      - "3000:3000"
  frontend:
    ports:
      - "4200:4200"
  db:
    ports:
      - "5432:5432"
```

**Using Docker secrets for credentials (example)**

Create an override file to supply secrets instead of environment variables for production:

```yaml
services:
  backend:
    environment:
      DATABASE_URL_FILE: /run/secrets/database_url
    secrets:
      - database_url
  db:
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password
  backup:
    environment:
      PGPASSFILE: /run/secrets/db_pgpass
    secrets:
      - db_pgpass

secrets:
  database_url:
    file: ./secrets/database_url.example
  db_password:
    file: ./secrets/db_password.example
  db_pgpass:
    file: ./secrets/db_pgpass.example
```
