import { Router } from 'express';
import { Cust_Put, Cust_Get_Edit, Cust_Delete } from '../controller/EditCustController.js';


const router = Router();

// -------------------------- update data------------------------

router.put('/edit/:id', Cust_Put);

// -------------------  get data to Edit Page  -----------------------
router.get('/edit/:id', Cust_Get_Edit);

// --------------------------delete single data from the database----------------------------------

router.delete('/edit/:id', Cust_Delete);

export default router;