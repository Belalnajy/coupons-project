# دليل إضافة صفحات جديدة - Waferlee.ae

## 1. إضافة صفحة ثابتة جديدة (Static Page)

### الخطوة 1: إنشاء ملف الصفحة

```bash
# من مجلد المشروع المحلي
cd frontend/src/pages
touch NewPage.tsx
```

### الخطوة 2: كتابة محتوى الصفحة

```tsx
// frontend/src/pages/NewPage.tsx

export default function NewPage() {
  return (
    <div className="min-h-screen bg-background text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">عنوان الصفحة</h1>
        <p className="text-light-grey">محتوى الصفحة هنا...</p>
      </div>
    </div>
  );
}
```

### الخطوة 3: إضافة الصفحة للـ Router

افتح ملف `frontend/src/App.tsx` وأضف:

```tsx
// 1. استيراد الصفحة في أعلى الملف
import NewPage from './pages/NewPage';

// 2. إضافة المسار داخل Routes
<Route path="/new-page" element={<NewPage />} />;
```

### الخطوة 4: إضافة رابط في القائمة (اختياري)

إذا أردت إضافة الصفحة للقائمة الرئيسية، عدّل ملف `Header.tsx`:

```tsx
<Link to="/new-page">اسم الصفحة</Link>
```

---

## 2. إضافة صفحة محمية (تتطلب تسجيل دخول)

```tsx
// في App.tsx
<Route
  path="/protected-page"
  element={
    <PrivateRoute>
      <ProtectedPage />
    </PrivateRoute>
  }
/>
```

---

## 3. إضافة صفحة للأدمن فقط

```tsx
// في App.tsx
<Route
  path="/admin/new-feature"
  element={
    <AdminRoute>
      <AdminNewFeature />
    </AdminRoute>
  }
/>
```

---

## 4. إضافة صفحة ديناميكية (مع باراميتر)

### مثال: صفحة تفاصيل متجر

```tsx
// frontend/src/pages/StoreDetails.tsx
import { useParams } from 'react-router-dom';

export default function StoreDetails() {
  const { slug } = useParams<{ slug: string }>();

  // جلب بيانات المتجر باستخدام slug

  return (
    <div>
      <h1>تفاصيل المتجر: {slug}</h1>
    </div>
  );
}
```

```tsx
// في App.tsx
<Route path="/store/:slug" element={<StoreDetails />} />
```

---

## 5. نشر التغييرات

بعد إضافة الصفحة الجديدة:

```bash
# محلياً
git add .
git commit -m "Add new page: [اسم الصفحة]"
git push

# على السيرفر
ssh root@72.62.71.79
cd /var/www/coupons
git pull
cd frontend
npm run build
rm -rf /home/waferlee.ae/public_html/*
cp -rv dist/* /home/waferlee.ae/public_html/
```

---

## 6. أمثلة لأنواع الصفحات

### صفحة "من نحن"

```tsx
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-green">من نحن</h1>
        <p className="text-light-grey leading-relaxed">
          وفّر لي هو منصة مجتمعية لمشاركة أفضل العروض والخصومات...
        </p>
      </div>
    </div>
  );
}
```

### صفحة "اتصل بنا"

```tsx
export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">اتصل بنا</h1>
        <form className="space-y-4">
          <input
            type="email"
            placeholder="بريدك الإلكتروني"
            className="w-full p-3 bg-grey rounded-lg"
          />
          <textarea
            placeholder="رسالتك"
            className="w-full p-3 bg-grey rounded-lg h-32"
          />
          <button className="bg-green px-6 py-3 rounded-lg">إرسال</button>
        </form>
      </div>
    </div>
  );
}
```

---

## ملاحظات

- ✅ استخدم الألوان المعرّفة في `index.css` (مثل `bg-background`, `text-green`, `bg-grey`)
- ✅ تأكد من أن الصفحة متجاوبة (Responsive) على الموبايل
- ✅ أضف عنوان الصفحة للـ SEO باستخدام `react-helmet` إذا لزم الأمر
