"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Product_1 = require("../models/Product");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Get all products (with filtering, sorting, searching)
router.get('/', async (req, res) => {
    try {
        const { category, search, sort, minPrice, maxPrice } = req.query;
        let query = {};
        if (category && category !== 'All Categories') {
            query.category = category;
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice)
                query.price.$gte = Number(minPrice);
            if (maxPrice)
                query.price.$lte = Number(maxPrice);
        }
        let sortOption = { createdAt: -1 }; // Default: Newest
        if (sort === 'priceAsc')
            sortOption = { price: 1 };
        else if (sort === 'priceDesc')
            sortOption = { price: -1 };
        const products = await Product_1.Product.find(query).sort(sortOption);
        console.log(`[Products] Found ${products.length} products.`);
        // Map _id to id for frontend compatibility
        const mappedProducts = products.map((p) => {
            const doc = p.toObject();
            return { ...doc, id: doc._id };
        });
        res.json(mappedProducts);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
});
// Admin: Get seller's own products
router.get('/seller', authMiddleware_1.authenticate, authMiddleware_1.requireAdmin, async (req, res) => {
    try {
        const products = await Product_1.Product.find({ seller: req.user.id }).sort({ createdAt: -1 });
        const mappedProducts = products.map((p) => {
            const doc = p.toObject();
            return { ...doc, id: doc._id };
        });
        res.json(mappedProducts);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch seller products' });
    }
});
// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product_1.Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const doc = product.toObject();
        res.json({ ...doc, id: doc._id });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch product' });
    }
});
// Admin: Create product
router.post('/', authMiddleware_1.authenticate, authMiddleware_1.requireAdmin, async (req, res) => {
    try {
        const newProduct = new Product_1.Product({
            ...req.body,
            seller: req.user.id
        });
        await newProduct.save();
        const doc = newProduct.toObject();
        res.status(201).json({ ...doc, id: doc._id });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create product' });
    }
});
// Admin: Update product
router.put('/:id', authMiddleware_1.authenticate, authMiddleware_1.requireAdmin, async (req, res) => {
    try {
        const product = await Product_1.Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Check ownership
        if (product.seller.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Not authorized to edit this product' });
        }
        Object.assign(product, req.body);
        await product.save();
        const doc = product.toObject();
        res.json({ ...doc, id: doc._id });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update product' });
    }
});
// Admin: Delete product
router.delete('/:id', authMiddleware_1.authenticate, authMiddleware_1.requireAdmin, async (req, res) => {
    try {
        const product = await Product_1.Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Check ownership
        if (product.seller.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this product' });
        }
        await Product_1.Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete product' });
    }
});
// Product Reviews
router.post('/:id/reviews', authMiddleware_1.authenticate, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product_1.Product.findById(req.params.id);
        if (product) {
            const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user.id.toString());
            if (alreadyReviewed) {
                return res.status(400).json({ message: 'Product already reviewed' });
            }
            const review = {
                user: req.user.id,
                username: req.user.username || 'Anonymous',
                rating: Number(rating),
                comment,
            };
            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating =
                product.reviews.reduce((acc, item) => item.rating + acc, 0) /
                    product.numReviews;
            await product.save();
            res.status(201).json({ message: 'Review added' });
        }
        else {
            res.status(404).json({ message: 'Product not found' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add review' });
    }
});
exports.default = router;
