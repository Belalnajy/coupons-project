# دليل صيانة الموقع - Waferlee.ae

## معلومات السيرفر

- **عنوان السيرفر:** `72.62.71.79`
- **الدخول عبر SSH:** `ssh root@72.62.71.79`
- **مسار المشروع:** `/var/www/coupons`
- **مسار الموقع المباشر:** `/home/waferlee.ae/public_html`

---

## 1. تحديث الموقع بعد أي تعديلات

عند إجراء أي تعديلات على الكود، قم بتنفيذ الخطوات التالية:

### تحديث الـ Backend

```bash
cd /var/www/coupons
git pull
cd backend
npm install
npm run build
pm2 restart backend
```

### تحديث الـ Frontend

```bash
cd /var/www/coupons/frontend
npm install
npm run build
rm -rf /home/waferlee.ae/public_html/*
cp -rv dist/* /home/waferlee.ae/public_html/
chown -R nginx:nginx /home/waferlee.ae/public_html
restorecon -Rv /home/waferlee.ae/public_html
```

---

## 2. مراقبة حالة الخدمات

### التحقق من حالة الـ Backend

```bash
pm2 status
pm2 logs backend --lines 50
```

### التحقق من حالة Nginx

```bash
systemctl status nginx
```

### التحقق من حالة قاعدة البيانات

```bash
systemctl status postgresql-15
```

---

## 3. إعادة تشغيل الخدمات

### إعادة تشغيل الـ Backend

```bash
pm2 restart backend
```

### إعادة تشغيل Nginx

```bash
systemctl restart nginx
```

### إعادة تشغيل قاعدة البيانات

```bash
systemctl restart postgresql-15
```

---

## 4. التحقق من المساحة والموارد

### مساحة القرص

```bash
df -h
```

### استخدام الذاكرة

```bash
free -h
```

### استخدام المعالج

```bash
top
```

---

## 5. شهادة SSL

الشهادة تتجدد تلقائياً عبر Certbot. للتحقق:

```bash
certbot certificates
```

للتجديد يدوياً (إذا لزم الأمر):

```bash
certbot renew
```

---

## 6. سجلات الأخطاء (Logs)

### سجلات الـ Backend

```bash
pm2 logs backend
```

### سجلات Nginx

```bash
tail -100 /var/log/nginx/error.log
tail -100 /var/log/nginx/access.log
```

### سجلات قاعدة البيانات

```bash
tail -100 /var/lib/pgsql/15/data/log/postgresql-*.log
```

---

## 7. تحذيرات هامة

⚠️ **لا تقم بإيقاف LiteSpeed:** تم تعطيل LiteSpeed لصالح Nginx. إذا أعاد التشغيل تلقائياً، قم بإيقافه:

```bash
pkill -9 litespeed
systemctl restart nginx
```

⚠️ **النسخ الاحتياطي:** قم بعمل نسخة احتياطية قبل أي تحديث كبير (انظر ملف BACKUP_RESTORE.md)

⚠️ **ملفات .env:** لا تشارك ملفات `.env` أبداً لأنها تحتوي على كلمات مرور حساسة
