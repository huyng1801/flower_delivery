const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

/**
 * Tạo đơn hàng mới
 */
async function createOrder(req, res) {
  try {
    const db = getDB();
    const { items, shippingAddress, phone } = req.body;
    const userId = req.user.userId;

    // Use the phone from request body directly
    let address = shippingAddress;
    let phoneNumber = phone || '';  // Rename to avoid conflict
    
    // Legacy parsing if old format is still sent
    if (typeof shippingAddress === 'string' && shippingAddress.includes(' - SĐT: ')) {
      const parts = shippingAddress.split(' - SĐT: ');
      address = parts[0];
      if (!phoneNumber) {
        phoneNumber = parts[1] || '';
      }
    }

    // Tính tổng tiền
    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      if (!ObjectId.isValid(item.flowerId)) {
        return res.status(400).json({
          success: false,
          message: 'ID hoa không hợp lệ'
        });
      }

      const flower = await db.collection('flowers').findOne({ _id: new ObjectId(item.flowerId) });
      
      if (!flower) {
        return res.status(404).json({
          success: false,
          message: `Không tìm thấy hoa với ID: ${item.flowerId}`
        });
      }

      if (flower.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Hoa "${flower.name}" không đủ số lượng`
        });
      }

      const itemTotal = flower.price * item.quantity;
      totalPrice += itemTotal;

      orderItems.push({
        flowerId: new ObjectId(item.flowerId),
        name: flower.name,
        category: flower.category,
        image: flower.image,
        price: flower.price,
        quantity: item.quantity
      });

      // Cập nhật số lượng hoa và số lượng đã bán
      await db.collection('flowers').updateOne(
        { _id: new ObjectId(item.flowerId) },
        { 
          $inc: { 
            quantity: -item.quantity,
            soldCount: item.quantity 
          } 
        }
      );
    }

    // Tạo đơn hàng
    const newOrder = {
      userId: new ObjectId(userId),
      items: orderItems,
      totalPrice,
      status: 'pending',
      shippingAddress: address,  // Use processed address
      phone: phoneNumber,  // Use the correct phone variable
      createdAt: new Date()
    };

    const result = await db.collection('orders').insertOne(newOrder);

    res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công',
      data: {
        orderId: result.insertedId,
        totalPrice,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Lỗi createOrder:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo đơn hàng'
    });
  }
}

/**
 * Lấy danh sách đơn hàng của user
 */
async function getUserOrders(req, res) {
  try {
    const db = getDB();
    const userId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await db.collection('orders')
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    const total = await db.collection('orders').countDocuments({ userId: new ObjectId(userId) });

    res.json({
      success: true,
      message: 'Lấy danh sách đơn hàng thành công',
      data: {
        orders,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Lỗi getUserOrders:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách đơn hàng'
    });
  }
}

/**
 * Lấy chi tiết một đơn hàng
 */
async function getOrderById(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;
    const userId = req.user.userId;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID đơn hàng không hợp lệ'
      });
    }

    const order = await db.collection('orders').findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(userId)
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    // Populate flower information for each item
    for (let item of order.items) {
      const flower = await db.collection('flowers').findOne({ _id: item.flowerId });
      if (flower) {
        item.flower = {
          _id: flower._id,
          name: flower.name,
          category: flower.category,
          image: flower.image,
          description: flower.description,
          freshnessDays: flower.freshnessDays
        };
      }
    }

    res.json({
      success: true,
      message: 'Lấy chi tiết đơn hàng thành công',
      data: order
    });
  } catch (error) {
    console.error('Lỗi getOrderById:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy chi tiết đơn hàng'
    });
  }
}

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById
};
