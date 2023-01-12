# Firovm Faucet

This is a simple faucet for Firovm. It is a simple web application that allows you to request Firovm coins for testing purposes.

- Config user and password for mongodb `mongo-init.js`

- Change user and password for root mongodb `MONGO_INITDB_ROOT_USERNAME`, `MONGO_INITDB_ROOT_PASSWORD` in `docker-compose.yml` and `docker-compose.dev.yml`

- Copy the file `.env.example` to `.env` and edit the file to your needs.

```bash
cp .env.example .env
```

## Start the application

```bash
# for test on local
docker compose up -d

# for development server
docker compose -f docker-compose.dev.yml up -d
```
