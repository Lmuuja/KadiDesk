import Customer from '../models/CustomerSchema.js';

// دالة لتنقية الرموز الخاصة بالـ Regex لحماية الاستعلامات
const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

const Cust_Get_Search = (req, res) => {
  res.render('customer/search', { customers: [], searchText: "" });
};

// ------------------- Search Data by Name --------------------------------
const Cust_Post_Search = async (req, res) => {
  try {
    const searchText = (req.body.searchText || "").trim();

    // 1. إذا كان مربع البحث فارغاً، نُرجع مصفوفة فارغة فوراً
    if (!searchText) {
      return res.render("customer/search", { customers: [], searchText: "" });
    }

    // تنقية النص للـ Regex
    const safeSearchText = escapeRegex(searchText);

    // 2. بناء شرط الاستعلام ليشمل جميع العملاء دون تقييد بـ createdBy
    let query = {
      $or: [
        { firstName: { $regex: safeSearchText, $options: "i" } },
        { lastName: { $regex: safeSearchText, $options: "i" } }
      ]
    };

    // 3. التنفيذ في MongoDB لجميع المستخدمين (extra_admin, admin, user)
    const result = await Customer.find(query);

    res.render("customer/search", { customers: result, searchText });
  } catch (err) {
    console.error("Search Error:", err);
    res.status(500).send("Error performing search");
  }
};

export { Cust_Get_Search, Cust_Post_Search };