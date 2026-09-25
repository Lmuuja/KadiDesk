// 1. التحقق من تسجيل الدخول بشكل عام لأي حساب
export const isAuth = (req, res, next) => {
  if (req.session && req.session.isLoggedIn) {
    return next();
  }
  res.redirect("/login");
};

// 2. خاص بـ Extra Admin فقط (إدارة الـ Admins والتحكم الكامل)
export const isExtraAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === "extra_admin") {
    return next();
  }
  res.status(403).send("عذراً، هذه الصفحة خاصة بـ Extra Admin فقط.");
};

// 3. خاص بـ Admins و Extra Admin معاً (لتسيير الموقع وإدارة الـ Users والعملاء)
export const isAdminOrExtra = (req, res, next) => {
  if (
    req.session &&
    req.session.user &&
    (req.session.user.role === "admin" || req.session.user.role === "extra_admin")
  ) {
    return next();
  }
  res.status(403).send("عذراً، لا تملك صلاحية التسيير.");
};