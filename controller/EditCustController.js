import { countries } from 'countries-list';
import moment from 'moment';
import Customer from '../models/CustomerSchema.js';


const Cust_Put = async (req, res) => {
    try {
        const customerId = req.params.id;
        const updatedData = req.body;

        const updatedCustomer = await Customer.findByIdAndUpdate(customerId, updatedData, { returnDocument: 'after' });

        if (!updatedCustomer) {
            return res.status(404).send('Customer not found');
        }

        // 👈 إعادة التوجيه للرئيسية بعد التحديث بنجاح
        return res.redirect('/');

    } catch (err) {
        console.error('Error updating customer:', err);
        return res.status(500).send('Internal Server Error');
    }
}

const Cust_Get_Edit = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).send('Customer not found');
    }

    const countriesList = Object.values(countries).map(c => c.name);

    return res.render('customer/edit', { 
      obj: customer, 
      moment: moment, 
      countries: countriesList 
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error fetching customer data");
  }
}


const Cust_Delete = async (req, res) => {
    try {
        const customerId = req.params.id;
        const deletedCustomer = await Customer.findByIdAndDelete(customerId);
        
        if (!deletedCustomer) {
            return res.status(404).send('Customer not found'); // ✅ إضافة return لإيقاف التنفيذ
        }
        
        return res.redirect('/'); // ✅ استجابة واحدة نهائية
    } catch (err) {
        return res.status(500).send('Error');
    }
}

export { Cust_Put, Cust_Get_Edit, Cust_Delete };