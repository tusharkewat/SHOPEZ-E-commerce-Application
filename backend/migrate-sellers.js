const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

async function migrate() {
  try {
    const mongoURI = process.env.MONGODB_URI;
    await mongoose.connect(mongoURI);
    
    // Find the main admin user
    const User = mongoose.model('User', new mongoose.Schema({ email: String, role: String }));
    const admin = await User.findOne({ email: 'admin@shopez.com' });
    
    if (!admin) {
      console.error('Admin user not found! Please run seedAdmin.js first.');
      process.exit(1);
    }

    console.log(`Found Admin: ${admin._id}`);

    // Update all products without a seller
    const Product = mongoose.model('Product', new mongoose.Schema({ seller: mongoose.Schema.Types.ObjectId }));
    const result = await Product.updateMany(
      { seller: { $exists: false } },
      { $set: { seller: admin._id } }
    );

    console.log(`Updated ${result.modifiedCount} products with seller ID.`);

    // Note: Migrating existing orders is harder because we don't know which seller owned the items before.
    // However, since initially there was only ONE admin, we can safely assign all existing order items to them.
    const Order = mongoose.model('Order', new mongoose.Schema({ items: Array }));
    const orders = await Order.find({});
    let updatedOrders = 0;

    for (const order of orders) {
      let modified = false;
      const newItems = order.items.map(item => {
        if (!item.seller) {
          modified = true;
          return { ...item, seller: admin._id };
        }
        return item;
      });

      if (modified) {
        await Order.updateOne({ _id: order._id }, { $set: { items: newItems } });
        updatedOrders++;
      }
    }

    console.log(`Updated ${updatedOrders} orders with seller IDs in items.`);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

migrate();
