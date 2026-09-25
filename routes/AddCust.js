import { Router } from 'express';
import { Cust_Post } from '../controller/AddCustController.js';
import { Cust_Get_Add } from '../controller/AddCustController.js';

const router = Router(); // 👈 الكود التنفيذي يأتي بعد كل الـ imports


// ----------------------post data to the database----------------------------------
router.post('/add', Cust_Post); 

// -------------------------- get list of countries from the countries-list package and pass it to the add.ejs view------------------------
router.get('/add', Cust_Get_Add); 

export default router;