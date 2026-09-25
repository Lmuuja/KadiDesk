import express from 'express';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import path from 'path';
import { fileURLToPath } from 'url';
import livereload from 'livereload';
import connectLivereload from 'connect-livereload';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// 1. استيراد متغيرات البيئة
dotenv.config();

// 2. استيراد النماذج والمسارات (Routes)
import User from './models/userSchema.js';
import authRoutes from './routes/authRoutes.js';
import IndexRoute from './routes/IndexRoute.js';
import addCustRoute from './routes/AddCust.js';
import editCustRoute from './routes/EditCust.js';
import searchCustRoute from './routes/SearchCust.js';
import viewCustRoute from './routes/ViewCust.js';

const app = express();

// Path Configuration for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// LiveReload Setup
const liveReloadServer = livereload.createServer();
liveReloadServer.watch('public');

liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/');
  }, 100);
});

app.use(connectLivereload());

// View Engine & Static Files
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Middleware استقبال البيانات
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// 3. إعداد الـ Session وتخزينها في MongoDB
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'my_super_secret_key_12345',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: 'sessions',
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // مدة الصلاحية: 24 ساعة
    },
  })
);

// 4. إتاحة بيانات المستخدم المسجل داخل كافة صفحات EJS تلقائياً
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.isAuth = req.session.isAuth || false;
  next();
});

// 5. دالة إنشاء حساب Extra Admin الرئيسي تلقائياً
const createInitialExtraAdmin = async () => {
  try {
    const extraAdminExists = await User.findOne({ role: 'extra_admin' });
    if (!extraAdminExists) {
      const username = process.env.EXTRA_ADMIN_USERNAME;
      const email = process.env.EXTRA_ADMIN_EMAIL;
      const rawPassword = process.env.EXTRA_ADMIN_PASSWORD;

      if (!username || !email || !rawPassword) {
        console.warn('⚠️ لم يتم إنشاء Extra Admin: يرجي التأكد من ضبط متغيرات البيئة في ملف .env');
        return;
      }

      const hashedPassword = await bcrypt.hash(rawPassword, 10);

      await User.create({
        username: username,
        email: email,
        password: hashedPassword,
        role: 'extra_admin',
      });

      console.log('✅ تم إنشاء حساب Extra Admin الرئيسي بنجاح.');
    }
  } catch (error) {
    console.error('❌ خطأ أثناء إنشاء Extra Admin:', error);
  }
};

// 6. تسجيل المسارات (Routes)
app.use(authRoutes);
app.use(IndexRoute);
app.use(addCustRoute);
app.use(editCustRoute);
app.use(searchCustRoute);
app.use(viewCustRoute);

// 7. الاتصال بقاعدة البيانات ثم تشغيل السيرفر
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully!');
    createInitialExtraAdmin(); // إنشاء حساب Extra Admin عند نجاح الاتصال
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => console.error('Connection error:', err));