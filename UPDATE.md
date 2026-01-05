# Server Update Guide

Use these steps to sync your local code changes with the production server.

## 1. Pull Latest Changes

Run at the project root:

```bash
cd /var/www/coupons
git pull
```

## 2. Update Backend

```bash
cd backend
npm install
npm run build
pm2 restart backend
```

## 3. Update Frontend

```bash
cd ../frontend
npm install
npm run build
# Clear old files and copy new ones
rm -rf /home/waferlee.ae/public_html/*
cp -rv dist/* /home/waferlee.ae/public_html/
```

## 4. Reset Permissions (SELinux)

**Important for Nginx to read the files:**

```bash
chown -R nginx:nginx /home/waferlee.ae/public_html
restorecon -Rv /home/waferlee.ae/public_html
```

---

### Troubleshooting

- **Backend Logs**: `pm2 logs backend`
- **Nginx Error Logs**: `tail -f /var/log/nginx/error.log`
- **Frontend Changes Not Showing**: Hard refresh the browser (`Ctrl + F5`).
