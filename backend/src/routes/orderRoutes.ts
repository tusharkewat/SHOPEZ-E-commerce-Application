import express, { Request, Response } from 'express';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// Place a new order
router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { totalAmount, paymentMethod, address, pincode, mobile, customerName, customerEmail, items } = req.body;

    // Transform items for Mongoose schema (productId -> product ref)
    const formattedItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }
      formattedItems.push({
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        seller: product.seller // Associate item with its seller
      });
    }

    const newOrder = new Order({
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
    
    // Decrement stock for each product
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }
    
    // Populate product details directly
    const populatedOrder = await Order.findById(newOrder._id).populate('items.product');
    
    // Format to match frontend expectations
    const orderDoc: any = populatedOrder?.toObject();
    orderDoc.id = orderDoc._id;
    orderDoc.order_items = orderDoc.items;

    res.status(201).json(orderDoc);
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Failed to place order' });
  }
});

// Get user's orders
router.get('/my-orders', authenticate, async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user?.id })
      .populate('items.product')
      .sort({ createdAt: -1 });

    const mappedOrders = orders.map(order => {
      const doc: any = order.toObject();
      return { ...doc, id: doc._id, order_items: doc.items };
    });

    res.json(mappedOrders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Admin: Get all orders
router.get('/', authenticate, requireAdmin, async (req: Request, res: Response) => {
  console.log(`[Admin] GET /api/orders called by user: ${req.user?.id} (${req.user?.role})`);
  try {
    const sellerId = req.user!.id;
    
    // Find orders where at least one item belongs to this seller
    const orders = await Order.find({ 'items.seller': sellerId })
      .populate('items.product')
      .sort({ createdAt: -1 });

    console.log(`[Admin] Found ${orders.length} orders containing items for seller ${sellerId}.`);

    const mappedOrders = orders.map(order => {
      const doc: any = order.toObject();
      // Filter items to only show this seller's products
      const sellerItems = doc.items.filter((item: any) => item.seller.toString() === sellerId);
      
      // Re-calculate total amount for THIS seller's part of the order (optional, but good for dashboard)
      const sellerTotal = sellerItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      
      return { 
        ...doc, 
        id: doc._id, 
        items: sellerItems,
        order_items: sellerItems,
        total_amount: sellerTotal // Override for seller dashboard stats
      };
    });

    res.json(mappedOrders);
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({ message: 'Failed to fetch all orders' });
  }
});

// Admin: Update order status
router.put('/:id/status', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id, 
      { status },
      { new: true }
    ).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const doc: any = order.toObject();
    res.json({ ...doc, id: doc._id, order_items: doc.items });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

export default router;
