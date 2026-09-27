import { Router } from 'express';
import { Cust_Get_Search, Cust_Post_Search } from '../controller/SearchCustController.js';
import { isAuth } from '../middleware/auth.js';

const router = Router();


router.get('/customer/search',  isAuth, Cust_Get_Search); // 👈 GET route for search page

router.post('/user/search', isAuth, Cust_Post_Search); // 👈 POST route for search functionality

export default router;
