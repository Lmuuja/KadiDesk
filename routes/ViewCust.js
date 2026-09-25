import { Router } from 'express';
import { Cust_Get_View, Cust_Get_Details } from '../controller/ViewCustController.js';



const router = Router(); // 👈 الكود التنفيذي يأتي بعد كل الـ imports

router.get('/customer/view',  Cust_Get_View);



router.get('/view/:id', Cust_Get_Details);

export default router;