import moment from 'moment';
import Customer from '../models/CustomerSchema.js';


const Cust_Get_View = (req, res) => {
    res.render('customer/view', { });
}
// --------------------------get single data from the database----------------------------------
const Cust_Get_Details = async (req, res) => {
    try {
        const customerId = req.params.id;
        const GetCustId = await Customer.findById(customerId);
        if (!GetCustId) {
            return res.status(404).send('Customer not found');
        }
        res.render('customer/view', { obj : GetCustId , moment : moment });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error");
    }
}
export { Cust_Get_View, Cust_Get_Details };