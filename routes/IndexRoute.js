import { Router } from 'express';
import Customer from '../models/CustomerSchema.js';
import User from '../models/userSchema.js';
import moment from 'moment';
import { isAuth } from '../middleware/auth.js';
import { isAdminOrExtra } from '../middleware/auth.js';


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

router.get('/users-list', isAuth, isAdminOrExtra, async (req, res) => {
  try {
    // استبعاد كلمة المرور من الاستعلام لزيادة الأمان
    const users = await User.find().select('-password');
    res.render('admin/users-list', { users, currentpage: 'usersList' });
  } catch (err) {
    res.status(500).send('خطأ في جلب المستخدمين');
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