import express from "express";
import bcrypt from "bcrypt";
import User from "../models/userSchema.js";
import { isAuth, isExtraAdmin, isAdminOrExtra } from "../middleware/auth.js";

const router = express.Router();

// ==========================================
// 1. مسارات تسجيل الدخول والخروج (Login / Logout)
// ==========================================

// عرض صفحة تسجيل الدخول
router.get("/login", (req, res) => {
  res.render("auth/login", { currentpage: "login" });
});

// معالجة بيانات تسجيل الدخول
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send("البريد الإلكتروني غير موجود");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("كلمة السر خاطئة");
    }

    // تخزين بيانات الجلسة عند نجاح الدخول
    req.session.isLoggedIn = true;
    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("حدث خطأ أثناء تسجيل الدخول");
  }
});

// تسجيل الخروج
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

// ==========================================
// 2. مسار إنشاء Users عاديين (خاص بـ Admin و Extra Admin)
// ==========================================

router.get("/admin/add-user", isAuth, isAdminOrExtra, (req, res) => {
  res.render("admin/add-user", { currentpage: "addUser" });
});

router.post("/admin/add-user", isAuth, isAdminOrExtra, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword,
      role: "user",
      createdBy: req.session.user.id,
    });

    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("حدث خطأ أثناء إنشاء المستخدم");
  }
});

// ==========================================
// 3. مسار إنشاء Admins جدد (خاص بـ Extra Admin فقط)
// ==========================================

router.get("/admin/add-admin", isAuth, isExtraAdmin, (req, res) => {
  res.render("admin/add-admin", { currentpage: "addAdmin" });
});

router.post("/admin/add-admin", isAuth, isExtraAdmin, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword,
      role: "admin",
      createdBy: req.session.user.id,
    });

    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("حدث خطأ أثناء إنشاء الأدمن");
  }
});

// ==========================================

// مسار حذف المستخدم أو المشرف
router.delete("/user/:id", isAuth, isAdminOrExtra, async (req, res) => {
  try {
    const targetUserId = req.params.id; // معرّف الحساب المراد حذفه
    const currentUser = req.session.user; // المستعمل الحالي الذي يقوم بعملية الحذف

    // 1. منع المستخدم من حذف حسابه الخاص
    if (currentUser._id === targetUserId) {
      return res.status(400).send("لا يمكنك حذف حسابك الخاص.");
    }

    // 2. البحث عن الحساب المراد حذفه
    const userToDelete = await User.findById(targetUserId);
    if (!userToDelete) {
      return res.status(404).send("المستخدم غير موجود.");
    }

    // 3. تطبيق قواعد الصلاحيات للحذف:

    // أ) منع حذف Extra Admin نهائياً
    if (userToDelete.role === "extra_admin") {
      return res.status(403).send("لا يمكن حذف حساب Extra Admin.");
    }

    // ب) إذا كان المستعمل الحالي Admin عادي وحاول حذف Admin آخر -> يمنع الإجراء
    if (currentUser.role === "admin" && userToDelete.role === "admin") {
      return res.status(403).send("ليس لديك صلاحية لحذف حساب Admin آخر.");
    }

    // 4. تنفيذ الحذف عند تحقق الشروط
    await User.findByIdAndDelete(targetUserId);

    res.status(200).send("تم حذف الحساب بنجاح.");
  } catch (error) {
    console.error(error);
    res.status(500).send("حدث خطأ أثناء عملية الحذف.");
  }
});

export default router;