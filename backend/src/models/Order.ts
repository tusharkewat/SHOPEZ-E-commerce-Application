import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  size: { type: String },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'PLACED' }, // PLACED, SHIPPED, DELIVERED, CANCELLED
    total_amount: { type: Number, required: true },
    payment_method: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    mobile: { type: String, required: true },
    customer_name: { type: String, required: true },
    customer_email: { type: String, required: true },
    items: [orderItemSchema], // Embedded array of items
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);
