const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(express.json());
app.use(cors()); // للسماح لأي دومين

// ملفات الموقع
app.use(express.static(path.join(__dirname)));

// ملف الطلبات
const ordersFile = './orders.json';

// جلب الطلبات للادمين
app.get('/admin/orders', (req,res)=>{
  if (!fs.existsSync(ordersFile)) return res.json([]);
  const orders = JSON.parse(fs.readFileSync(ordersFile));
  res.json(orders);
});

// إضافة طلب جديد
app.post('/orders', (req,res)=>{
  const order = req.body;
  if (!fs.existsSync(ordersFile)) fs.writeFileSync(ordersFile, "[]");
  let orders = JSON.parse(fs.readFileSync(ordersFile));
  orders.push(order);
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null,2));
  res.send('✅ تم ارسال الطلب بنجاح');
});

// تعديل حالة الطلب
app.patch('/admin/orders/:id', (req,res)=>{
  const id = req.params.id;
  const {status} = req.body;
  let orders = JSON.parse(fs.readFileSync(ordersFile));
  orders = orders.map(o => { if(o.id===id) o.status=status; return o; });
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null,2));
  res.send('✅ تم تحديث الحالة');
});

// حذف الطلب
app.delete('/admin/orders/:id', (req,res)=>{
  const id = req.params.id;
  let orders = JSON.parse(fs.readFileSync(ordersFile));
  orders = orders.filter(o => o.id!==id);
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null,2));
  res.send('✅ تم حذف الطلب');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
