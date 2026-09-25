import { Router } from 'express';
import Customer from '../models/CustomerSchema.js';
import User from '../models/userSchema.js';
import moment from 'moment';
import { isAuth } from '../middleware/auth.js';


const router = Router(); // 👈 الكود التنفيذي يأتي بعد كل الـ imports


router.get("/", isAuth, async (req, res) => {
    try {
        const result = await Customer.find();
        res.render('index', { customers: result , moment : moment});

    } catch (err) {
        console.log(err);
        res.status(500).send("Error");
    }
});


//-----------------------------------------------------------------

router.get('/users-list', async (req, res) => {
  try {
    const users = await User.find();

    // ⚠️ تأكد من كتابة المسار بدون شفرة زائدة وبدون الامتداد ejs
    res.render('admin/users-list', { users: users }); 
  } catch (err) {
    console.log(err);
    res.status(500).send("Error loading users");
  }
});

//-----------------------------------------------------------------

// مسار حذف المستخدم
router.delete('/delete-user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // مسح المستخدم من قاعدة البيانات
    await User.findByIdAndDelete(userId);

    // إعادة التوجيه إلى نفس الصفحة بعد الحذف
    res.redirect('/users-list');
  } catch (err) {
    console.log(err);
    res.status(500).send("خطأ أثناء حذف المستخدم");
  }
});


export default router;