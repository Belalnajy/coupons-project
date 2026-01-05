# دليل النسخ الاحتياطي والاستعادة - Waferlee.ae

## 1. النسخ الاحتياطي لقاعدة البيانات

### نسخة احتياطية كاملة

```bash
# الدخول للسيرفر
ssh root@72.62.71.79

# إنشاء نسخة احتياطية
sudo -u postgres pg_dump coupons > /var/backups/coupons_$(date +%Y%m%d_%H%M%S).sql

# التحقق من النسخة
ls -la /var/backups/
```

### نسخة احتياطية مضغوطة (موصى بها)

```bash
sudo -u postgres pg_dump coupons | gzip > /var/backups/coupons_$(date +%Y%m%d_%H%M%S).sql.gz
```

---

## 2. استعادة قاعدة البيانات

### استعادة من نسخة عادية

```bash
# إيقاف الـ Backend أولاً
pm2 stop backend

# استعادة القاعدة
sudo -u postgres psql coupons < /var/backups/coupons_YYYYMMDD_HHMMSS.sql

# إعادة تشغيل الـ Backend
pm2 start backend
```

### استعادة من نسخة مضغوطة

```bash
pm2 stop backend
gunzip -c /var/backups/coupons_YYYYMMDD_HHMMSS.sql.gz | sudo -u postgres psql coupons
pm2 start backend
```

---

## 3. النسخ الاحتياطي للكود

### نسخ المشروع بالكامل

```bash
cd /var/www
tar -czvf /var/backups/coupons_code_$(date +%Y%m%d).tar.gz coupons/
```

### نسخ ملفات البيئة فقط

```bash
cp /var/www/coupons/backend/.env /var/backups/backend_env_$(date +%Y%m%d)
cp /var/www/coupons/frontend/.env /var/backups/frontend_env_$(date +%Y%m%d)
```

---

## 4. النسخ الاحتياطي للملفات المرفوعة

```bash
# إذا كان هناك مجلد uploads
tar -czvf /var/backups/uploads_$(date +%Y%m%d).tar.gz /var/www/coupons/backend/uploads/
```

---

## 5. جدولة النسخ الاحتياطي التلقائي

### إنشاء سكريبت النسخ الاحتياطي

```bash
nano /var/backups/backup.sh
```

أضف المحتوى التالي:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# نسخ قاعدة البيانات
sudo -u postgres pg_dump coupons | gzip > $BACKUP_DIR/coupons_db_$DATE.sql.gz

# حذف النسخ الأقدم من 7 أيام
find $BACKUP_DIR -name "coupons_db_*.sql.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

### تفعيل السكريبت

```bash
chmod +x /var/backups/backup.sh
```

### جدولة التشغيل اليومي (كل يوم الساعة 3 صباحاً)

```bash
crontab -e
```

أضف السطر التالي:

```
0 3 * * * /var/backups/backup.sh >> /var/log/backup.log 2>&1
```

---

## 6. نقل النسخ الاحتياطية لموقع خارجي

### نقل لجهازك المحلي

```bash
# من جهازك المحلي
scp root@72.62.71.79:/var/backups/coupons_*.sql.gz ~/backups/
```

### نقل لـ Google Drive أو Dropbox

يمكنك استخدام أدوات مثل `rclone` للنقل التلقائي.

---

## 7. التحقق من سلامة النسخة الاحتياطية

```bash
# فحص ملف مضغوط
gunzip -t /var/backups/coupons_db_YYYYMMDD.sql.gz

# إذا ظهر "OK" فالملف سليم
```

---

## ملاحظات هامة

- ✅ قم بعمل نسخة احتياطية قبل أي تحديث كبير
- ✅ احتفظ بنسخة واحدة على الأقل خارج السيرفر
- ✅ اختبر استعادة النسخة الاحتياطية بشكل دوري
- ⚠️ لا تحذف النسخ الاحتياطية الأخيرة إلا بعد التأكد من عمل النسخة الجديدة
