import { Router, Response } from 'express';
import { prisma } from '../prisma.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import { calculateEnvironmentalImpact } from '../services/impactCalculator.js';

export const checkoutRouter = Router();

// GET order details for checkout page
checkoutRouter.get('/:orderId', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        material: {
          include: { images: true },
        },
        seller: {
          select: { id: true, businessName: true, city: true, phone: true },
        },
        buyer: {
          select: { id: true, businessName: true, city: true, phone: true },
        },
        payment: true,
      },
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found.' });
      return;
    }

    if (order.buyerId !== req.user!.id) {
      res.status(403).json({ error: 'Unauthorized to checkout this order.' });
      return;
    }

    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch checkout details.' });
  }
});

// POST simulated payment execution
checkoutRouter.post('/:orderId/pay', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { paymentMethod, paymentDetails } = req.body; // paymentMethod: "UPI" | "CARD" | "NETBANKING" | "BANK_TRANSFER"

    if (!paymentMethod) {
      res.status(400).json({ error: 'Please select a simulated payment method.' });
      return;
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        material: true,
        seller: true,
        buyer: true,
        payment: true,
      },
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found.' });
      return;
    }

    if (order.buyerId !== req.user!.id) {
      res.status(403).json({ error: 'Unauthorized to pay for this order.' });
      return;
    }

    if (order.paymentStatus === 'PAID') {
      res.status(400).json({ error: 'Order has already been paid.' });
      return;
    }

    const transactionRef = `TXN-${paymentMethod}-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    // 1. Create Payment record
    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: order.totalAmount,
        paymentMethod,
        transactionRef,
        status: 'SUCCESS',
      },
    });

    // 2. Update Order
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: 'PAID',
        deliveryStatus: 'PROCESSING',
      },
      include: {
        material: { include: { images: true } },
        payment: true,
        seller: { select: { id: true, businessName: true, phone: true } },
        buyer: { select: { id: true, businessName: true, phone: true } },
      },
    });

    // 3. Compute Environmental Impact and record it
    let quantityKg = order.quantity;
    if (order.material.unit === 'tons') quantityKg = order.quantity * 1000;
    else if (order.material.unit === 'pallets') quantityKg = order.quantity * 25;
    else if (order.material.unit === 'pieces') quantityKg = order.quantity * 2;

    const impact = calculateEnvironmentalImpact(order.material.category, quantityKg);

    const impactRecord = await prisma.impactRecord.create({
      data: {
        orderId: order.id,
        materialCategory: order.material.category,
        quantityKg,
        co2SavedKg: impact.co2SavedKg,
        landfillDivertedKg: impact.landfillDivertedKg,
        waterSavedLiters: impact.waterSavedLiters,
        treesEquivalent: impact.treesEquivalent,
        transactionValue: order.totalAmount,
      },
    });

    // 4. Update material listing stock
    const remainingQty = Math.max(0, order.material.quantity - order.quantity);
    await prisma.materialListing.update({
      where: { id: order.materialId },
      data: {
        quantity: remainingQty,
        status: remainingQty === 0 ? 'SOLD' : 'ACTIVE',
      },
    });

    // 5. Notifications
    await prisma.notification.create({
      data: {
        userId: order.sellerId,
        title: 'Payment Received for Order!',
        message: `${order.buyer.businessName} completed payment of ₹${order.totalAmount.toLocaleString('en-IN')} for Order #${order.orderNumber}. Prepare for dispatch.`,
        type: 'PAYMENT',
        link: `/orders/${order.id}`,
      },
    });

    await prisma.notification.create({
      data: {
        userId: order.buyerId,
        title: 'Payment Successful!',
        message: `Simulated payment of ₹${order.totalAmount.toLocaleString('en-IN')} confirmed. Ref: ${transactionRef}. You diverted ${quantityKg} kg of waste!`,
        type: 'PAYMENT',
        link: `/orders/${order.id}`,
      },
    });

    res.json({
      message: 'Simulated payment completed successfully! EcoLoop escrow credited.',
      payment,
      order: updatedOrder,
      impactRecord,
    });
  } catch (error) {
    console.error('Checkout payment error:', error);
    res.status(500).json({ error: 'Failed to process payment.' });
  }
});
