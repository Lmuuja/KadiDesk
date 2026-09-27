import { Router } from 'express';
import { Cust_Put, Cust_Get_Edit, Cust_Delete } from '../controller/EditCustController.js';
import { isAuth } from '../middleware/auth.js';

const router = Router();

// -------------------------- update data------------------------

router.put('/edit/:id', isAuth, Cust_Put);

// -------------------  get data to Edit Page  -----------------------
router.get('/edit/:id', isAuth, Cust_Get_Edit);

// --------------------------delete single data from the database----------------------------------

router.delete('/edit/:id', isAuth, Cust_Delete);

export default router;