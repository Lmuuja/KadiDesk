import { Router } from 'express';
import { Cust_Post } from '../controller/AddCustController.js';
import { Cust_Get_Add } from '../controller/AddCustController.js';
import { isAuth } from '../middleware/auth.js';

const router = Router(); // 👈 الكود التنفيذي يأتي بعد كل الـ imports


// ----------------------post data to the database----------------------------------
router.post('/add', isAuth, Cust_Post); 

// -------------------------- get list of countries from the countries-list package and pass it to the add.ejs view------------------------
router.get('/add', isAuth, Cust_Get_Add); 

export default router;