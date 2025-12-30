# Deployment Guide (AlmaLinux / RHEL)

This guide walks you through deploying the **Coupons Application** (NestJS Backend + React Frontend) to a fresh **AlmaLinux 8/9** VPS on Hostinger.

## Prerequisites

- A Hostinger VPS running **AlmaLinux**.
- Root access (SSH).
- A domain name pointing to your VPS IP address.

---

## 1. Initial Server Setup

Update system packages and install essential tools.

```bash
# Update system
dnf update -y

# Install basics
dnf install -y curl wget git vim tar
```

## 2. Install Node.js (v18)

Use the NodeSource repository for Enterprise Linux.

```bash
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
dnf install -y nodejs

# Verify installation
node -v
npm -v
```

## 3. Install Process Manager (PM2)

```bash
npm install -g pm2
```

## 4. Install & Configure PostgreSQL

We will install PostgreSQL 15 (stable).

```bash
# Install repo config
dnf install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-9-x86_64/pgdg-redhat-repo-latest.noarch.rpm

# Disable built-in postgresql module (to avoid conflicts)
dnf -qy module disable postgresql

# Install server
dnf install -y postgresql15-server

# Initialize database
/usr/pgsql-15/bin/postgresql-15-setup initdb

# Enable and start service
systemctl enable postgresql-15
systemctl start postgresql-15
```

**Create Database and User:**
Login to Postgres CLI:

```bash
sudo -i -u postgres
psql
```

Run SQL commands (replace `strong_password` with a real password):

```sql
CREATE DATABASE coupons;
CREATE USER coupons_user WITH PASSWORD 'strong_password';
GRANT ALL PRIVILEGES ON DATABASE coupons TO coupons_user;
-- Grant schema usage if needed (Postgres 15+ specific)
GRANT ALL ON SCHEMA public TO coupons_user;
ALTER DATABASE coupons OWNER TO coupons_user;
\q
```

Exit the postgres user session:

```bash
exit
```

**Configure Authentication (Important for local connection):**
Edit `pg_hba.conf` to allow password login.

```bash
nano /var/lib/pgsql/15/data/pg_hba.conf
```

Find the lines for `IPv4 local connections` and change `ident` or `scram-sha-256` to `md5` (or trust, though less secure) if you encounter auth errors, or ensure your app uses the correct auth method. Usually `md5` or `scram-sha-256` works fine with the password.

Restart Postgres:

```bash
systemctl restart postgresql-15
```

## 5. Install Nginx (Web Server)

```bash
dnf install -y nginx
systemctl enable nginx
systemctl start nginx
```

**SELinux Configuration (Crucial):**
Allow Nginx to make network connections (reverse proxy) and read files.

```bash
setsebool -P httpd_can_network_connect 1
```

## 6. Deployment Steps

### A. Clone the Repository

```bash
mkdir -p /var/www
cd /var/www
git clone <YOUR_GITHUB_REPO_URL> coupons
cd coupons
```

### B. Deploy Backend (NestJS)

Navigate to backend folder: `cd backend`

1. **Install & Build**:

   ```bash
   npm install
   npm run build
   ```

2. **Configure .env**:
   Create `.env` file with your DB credentials and `PORT=3000`.

3. **Start with PM2**:
   ```bash
   pm2 start dist/main.js --name backend
   pm2 save
   pm2 startup
   ```

### C. Deploy Frontend (React/Vite)

Navigate to frontend folder: `cd ../frontend`

1. **Install & Build**:

   ```bash
   npm install
   # Create .env.production with VITE_API_URL=https://yourdomain.com/api
   npm run build
   ```

2. **Move Files**:

   ```bash
   mkdir -p /var/www/html/coupons
   cp -r dist/* /var/www/html/coupons/

   # Set Permissions
   chown -R nginx:nginx /var/www/html/coupons
   chmod -R 755 /var/www/html/coupons
   # Ensure SELinux context is correct for web files
   chcon -R -t httpd_sys_content_t /var/www/html/coupons
   ```

## 7. Configure Nginx

Create config file: `/etc/nginx/conf.d/coupons.conf` (AlmaLinux uses `conf.d` by default).

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/html/coupons;
    index index.html;

    # Frontend
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend Proxy
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Restart Nginx:

```bash
systemctl restart nginx
```

## 8. Firewall (firewalld)

Allow HTTP and HTTPS traffic.

```bash
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload
```

## 9. SSL (Certbot)

```bash
dnf install -y epel-release
dnf install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com
```
