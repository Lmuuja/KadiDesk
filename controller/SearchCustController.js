import Customer from '../models/CustomerSchema.js';



const Cust_Get_Search = (req, res) => {
    res.render('customer/search', { });
}


// -------------------  Search Data by Name  --------------------------------
const Cust_Post_Search =  async (req, res) => {
  try {
    const searchText = (req.body.searchText || "").trim();

    // 1. إذا كان مربع البحث فارغاً، نُرجع مصفوفة فارغة فوراً دون البحث في قاعدة البيانات
    if (!searchText) {
      return res.render("customer/search", { customers: [], searchText: "" });
    }

    // 2. التنفيذ في MongoDB فقط عند وجود نص حقيقي
    const result = await Customer.find({
      $or: [
        { firstName: { $regex: searchText, $options: "i" } },
        { lastName: { $regex: searchText, $options: "i" } }
      ]
    }); 
    res.render("customer/search", { customers: result, searchText });
    console.log(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error performing search");
  }
}


export { Cust_Get_Search , Cust_Post_Search };