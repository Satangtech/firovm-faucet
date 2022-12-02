# Firovm Faucet

This is a simple faucet for Firovm. It is a simple web application that allows you to request Firovm coins for testing purposes.

Copy the file `.env.example` to `.env` and edit the file to your needs.

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
