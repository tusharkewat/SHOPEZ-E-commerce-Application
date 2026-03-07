"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Order_1 = require("../models/Order");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Place a new order
router.post('/', authMiddleware_1.authenticate, async (req, res) => {
    try {
        const userId = req.user?.id;
        const { totalAmount, paymentMethod, address, pincode, mobile, customerName, customerEmail, items } = req.body;
        // Transform items for Mongoose schema (productId -> product ref)
        const formattedItems = items.map((item) => ({
            product: item.productId,
            quantity: item.quantity,
            price: item.price,
            size: item.size
        }));
        const newOrder = new Order_1.Order({
            user: userId,
            total_amount: totalAmount,
            payment_method: paymentMethod,
            address,
            pincode,
            mobile,
            customer_name: customerName,
            customer_email: customerEmail,
            status: 'PLACED',
            items: formattedItems
        });
        await newOrder.save();
        // Populate product details directly
        const populatedOrder = await Order_1.Order.findById(newOrder._id).populate('items.product');
        // Format to match frontend expectations
        const orderDoc = populatedOrder?.toObject();
        orderDoc.id = orderDoc._id;
        orderDoc.order_items = orderDoc.items;
        res.status(201).json(orderDoc);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to place order' });
    }
});
// Get user's orders
router.get('/my-orders', authMiddleware_1.authenticate, async (req, res) => {
    try {
        const orders = await Order_1.Order.find({ user: req.user?.id })
            .populate('items.product')
            .sort({ createdAt: -1 });
        const mappedOrders = orders.map(order => {
            const doc = order.toObject();
            return { ...doc, id: doc._id, order_items: doc.items };
        });
        res.json(mappedOrders);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});
// Admin: Get all orders
router.get('/', authMiddleware_1.authenticate, authMiddleware_1.requireAdmin, async (req, res) => {
    try {
        const orders = await Order_1.Order.find()
            .populate('items.product')
            .sort({ createdAt: -1 });
        const mappedOrders = orders.map(order => {
            const doc = order.toObject();
            return { ...doc, id: doc._id, order_items: doc.items };
        });
        res.json(mappedOrders);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch all orders' });
    }
});
// Admin: Update order status
router.put('/:id/status', authMiddleware_1.authenticate, authMiddleware_1.requireAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order_1.Order.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('items.product');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        const doc = order.toObject();
        res.json({ ...doc, id: doc._id, order_items: doc.items });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update order status' });
    }
});
exports.default = router;
