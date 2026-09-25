import { Router } from 'express';
import { Cust_Get_Search, Cust_Post_Search } from '../controller/SearchCustController.js';


const router = Router();


router.get('/customer/search',  Cust_Get_Search); // 👈 GET route for search page

router.post('/user/search',Cust_Post_Search); // 👈 POST route for search functionality

export default router;
