import Customer from '../models/CustomerSchema.js';
import { countries } from 'countries-list';


const Cust_Post = async (req, res) => {
    try {
        const customerData = new Customer(req.body);
        await customerData.save();
        res.redirect('/'); // Redirect to the view page after successful submission
    } catch (error) {
        console.error('Error saving customer data:', error);
        res.status(500).send('Internal Server Error');
    }
}

// --------------------------------------------------------------

const Cust_Get_Add = (req, res) => {
    // تحويل كائن الدول المباشر إلى مصفوفة أسماء
    const countriesList = Object.values(countries).map(c => c.name);
    return res.render('customer/add', { countries: countriesList });
}

export { Cust_Post, Cust_Get_Add };