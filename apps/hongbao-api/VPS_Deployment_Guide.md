# VPS Deployment Guide

A step-by-step guide for deploying a NestJS + PostgreSQL app to a VPS with Nginx, PM2, and HTTPS.

---

## 1. Connect to the VPS

```bash
ssh root@your_vps_ip
```

---

## 2. Install Basics

```bash
apt update && apt upgrade -y
apt install -y git curl build-essential
```

---

## 3. Install Node.js (via nvm)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 22
nvm use 22
node -v
```

---

## 4. Install PostgreSQL

```bash
apt install postgresql postgresql-contrib -y
systemctl start postgresql
systemctl enable postgresql
```

---

## 5. Create Database + User

Enter the Postgres shell:

```bash
sudo -u postgres psql
```

Then run:

```sql
CREATE DATABASE hongbaodb;
CREATE USER hongbaouser WITH PASSWORD 'strongpassword';
ALTER ROLE hongbaouser SET client_encoding TO 'utf8';
ALTER ROLE hongbaouser SET default_transaction_isolation TO 'read committed';
ALTER ROLE hongbaouser SET timezone TO 'UTC';

-- must match DB name
GRANT ALL PRIVILEGES ON DATABASE hongbaodb TO hongbaouser;

-- needed on PG15+, otherwise `prisma migrate` fails on the public schema
ALTER DATABASE hongbaodb OWNER TO hongbaouser;

\c hongbaodb
GRANT ALL ON SCHEMA public TO hongbaouser;
\q
```

---

## 6. Configure PostgreSQL

**Skip this step entirely.**

Your app connects via `localhost:5432` (see `DATABASE_URL` below), so Postgres never needs to accept remote connections. Opening `listen_addresses='*'` and `0.0.0.0/0` in `pg_hba.conf` exposes your DB to the internet — a common way VPS databases get compromised.

Leave the default config (localhost only). Only touch this if you specifically need external DB access (e.g. from your laptop via a DB client) — and even then, prefer an **SSH tunnel** over opening the port.

---

## 7. Set Up Git

```bash
git config --global user.name "mg-kh"
git config --global user.email "dev.kaunghtet@gmail.com"
git config --list

ssh-keygen -t ed25519 -C "dev.kaunghtet@gmail.com"
cat ~/.ssh/id_ed25519.pub
```

Paste this key into **GitHub → Settings → SSH Keys** (or as a repo Deploy Key) **before** cloning.

```bash
ssh -T git@github.com
```

---

## 8. Clone & Configure the Project

```bash
git clone your_repo_url
cd your_project

npm install -g yarn
yarn install

nano .env
```

**`.env` contents:**

```env
DATABASE_URL=postgresql://hongbaouser:strongpassword@localhost:5432/hongbaodb
NODE_ENV=production

# + all other secrets your app needs:
# CLERK_SECRET_KEY, CLERK_WEBHOOK_SECRET, R2 access keys, FCM service account, etc.
# (anything from your local .env)
```

Generate the Prisma client, run migrations, and build:

```bash
npx prisma generate
npx prisma migrate deploy
yarn build
```

> `yarn build` is required — `dist/` won't exist otherwise, and PM2 will fail to start.

---

## 9. Install PM2 & Start the App

```bash
npm install -g pm2
pm2 start dist/src/main.js --name hongbao-be --max-memory-restart 200M
pm2 startup
pm2 save
```

---

## 10. Install & Configure Nginx

```bash
apt install nginx -y
nano /etc/nginx/sites-available/default
```

Replace the contents with:

```nginx
server {
    listen 80;
    server_name your_domain_or_ip;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Test the config and restart Nginx:

```bash
nginx -t
systemctl restart nginx
```

---

## 11. Enable Firewall

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```
