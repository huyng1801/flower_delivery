const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'flower_delivery';

// Dữ liệu hoa tươi thực tế (Tiếng Việt)
const flowers = [
  // Hoa hồng
  {
    name: 'Hoa Hồng Đỏ Ecuador',
    category: 'Hoa hồng',
    price: 150000,
    description: 'Hoa hồng đỏ Ecuador cao cấp, thân dài 60-70cm, đầu hoa to đẹp. Thích hợp làm quà tặng cho người yêu hoặc dịp lễ tình nhân.',
    image: 'https://picsum.photos/280/350?random=1',
    quantity: 100,
    rating: 4.9,
    freshnessDays: 7,
    occasions: ['Tình yêu', 'Valentine', 'Sinh nhật', 'Kỷ niệm'],
    colors: ['Đỏ'],
    soldCount: 245,
    createdAt: new Date()
  },
  {
    name: 'Hoa Hồng Trắng Đà Lạt',
    category: 'Hoa hồng',
    price: 120000,
    description: 'Hoa hồng trắng Đà Lạt tươi mát, biểu tượng của sự tinh khiết và thuần khiết. Phù hợp cho đám cưới và các dịp trang trọng.',
    image: 'https://picsum.photos/280/350?random=2',
    quantity: 80,
    rating: 4.8,
    freshnessDays: 6,
    occasions: ['Đám cưới', 'Tốt nghiệp', 'Khai trương'],
    colors: ['Trắng'],
    soldCount: 189,
    createdAt: new Date()
  },
  {
    name: 'Hoa Hồng Vàng Pháp',
    category: 'Hoa hồng',
    price: 135000,
    description: 'Hoa hồng vàng nhập khẩu từ Pháp, màu vàng rực rỡ tượng trưng cho tình bạn và hạnh phúc.',
    image: 'https://picsum.photos/280/350?random=3',
    quantity: 60,
    rating: 4.7,
    freshnessDays: 8,
    occasions: ['Bạn bè', 'Chúc mừng', 'Sinh nhật'],
    colors: ['Vàng'],
    soldCount: 156,
    createdAt: new Date()
  },
  {
    name: 'Hoa Hồng Hồng Cát Tường',
    category: 'Hoa hồng',
    price: 110000,
    description: 'Hoa hồng màu hồng pastel dịu dàng, mang lại cảm giác ấm áp và ngọt ngào.',
    image: 'https://picsum.photos/280/350?random=4',
    quantity: 90,
    rating: 4.6,
    freshnessDays: 7,
    occasions: ['Sinh nhật', 'Tình yêu', 'Cảm ơn'],
    colors: ['Hồng'],
    soldCount: 203,
    createdAt: new Date()
  },

  // Hoa cúc
  {
    name: 'Cúc Họa Mi Trắng',
    category: 'Hoa cúc',
    price: 45000,
    description: 'Hoa cúc họa mi trắng tinh khiết, mùi hương nhẹ nhàng. Phù hợp trang trí nhà cửa và làm quà tặng.',
    image: 'https://picsum.photos/280/350?random=5',
    quantity: 200,
    rating: 4.5,
    freshnessDays: 5,
    occasions: ['Trang trí', 'Thăm hỏi', 'Cúng bái'],
    colors: ['Trắng'],
    soldCount: 312,
    createdAt: new Date()
  },
  {
    name: 'Cúc Ping Pong Vàng',
    category: 'Hoa cúc',
    price: 65000,
    description: 'Hoa cúc ping pong vàng tròn đều, màu sắc rực rỡ, thường được sử dụng trong các bó hoa mixed.',
    image: 'https://picsum.photos/280/350?random=6',
    quantity: 150,
    rating: 4.4,
    freshnessDays: 10,
    occasions: ['Trang trí', 'Chúc mừng', 'Khai trương'],
    colors: ['Vàng'],
    soldCount: 167,
    createdAt: new Date()
  },
  {
    name: 'Cúc Calimero Trắng',
    category: 'Hoa cúc',
    price: 55000,
    description: 'Hoa cúc calimero nhỏ xinh, đầu hoa nhỏ như bông cotton, rất dễ thương và bắt mắt.',
    image: 'https://picsum.photos/280/350?random=7',
    quantity: 120,
    rating: 4.6,
    freshnessDays: 8,
    occasions: ['Trang trí', 'Sinh nhật', 'Cảm ơn'],
    colors: ['Trắng'],
    soldCount: 134,
    createdAt: new Date()
  },

  // Hoa ly
  {
    name: 'Hoa Ly Trắng Tinh Khôi',
    category: 'Hoa ly',
    price: 180000,
    description: 'Hoa ly trắng cao cấp, cánh hoa to đẹp, hương thơm quyến rũ. Symbol của sự tinh khiết và cao quý.',
    image: 'https://picsum.photos/280/350?random=8',
    quantity: 70,
    rating: 4.9,
    freshnessDays: 10,
    occasions: ['Đám cưới', 'Lễ kỷ niệm', 'Tôn giáo'],
    colors: ['Trắng'],
    soldCount: 89,
    createdAt: new Date()
  },
  {
    name: 'Hoa Ly Vàng Oriental',
    category: 'Hoa ly',
    price: 165000,
    description: 'Hoa ly vàng oriental với hương thơm đặc trưng, cánh hoa có chấm đốm đen đẹp mắt.',
    image: 'https://picsum.photos/280/350?random=9',
    quantity: 55,
    rating: 4.8,
    freshnessDays: 12,
    occasions: ['Sinh nhật', 'Chúc mừng', 'Trang trí'],
    colors: ['Vàng'],
    soldCount: 76,
    createdAt: new Date()
  },
  {
    name: 'Hoa Ly Hồng Stargazer',
    category: 'Hoa ly',
    price: 195000,
    description: 'Hoa ly stargazer màu hồng với viền trắng, một trong những loại ly đẹp và thơm nhất.',
    image: 'https://picsum.photos/280/350?random=10',
    quantity: 45,
    rating: 5.0,
    freshnessDays: 14,
    occasions: ['Tình yêu', 'Đặc biệt', 'Sinh nhật'],
    colors: ['Hồng'],
    soldCount: 123,
    createdAt: new Date()
  },

  // Hoa tulip
  {
    name: 'Tulip Đỏ Holland',
    category: 'Hoa tulip',
    price: 85000,
    description: 'Hoa tulip đỏ nhập khẩu từ Hà Lan, biểu tượng của tình yêu mãnh liệt và sự quyến rũ.',
    image: 'https://picsum.photos/280/350?random=11',
    quantity: 100,
    rating: 4.7,
    freshnessDays: 7,
    occasions: ['Tình yêu', 'Valentine', '8/3'],
    colors: ['Đỏ'],
    soldCount: 198,
    createdAt: new Date()
  },
  {
    name: 'Tulip Vàng Sunshine',
    category: 'Hoa tulip',
    price: 75000,
    description: 'Hoa tulip vàng rực rỡ như ánh nắng, mang lại niềm vui và năng lượng tích cực.',
    image: 'https://picsum.photos/280/350?random=12',
    quantity: 85,
    rating: 4.6,
    freshnessDays: 6,
    occasions: ['Chúc mừng', 'Khai trương', 'Sinh nhật'],
    colors: ['Vàng'],
    soldCount: 145,
    createdAt: new Date()
  },
  {
    name: 'Tulip Trắng Queen',
    category: 'Hoa tulip',
    price: 80000,
    description: 'Hoa tulip trắng thanh khiết, đơn giản nhưng thanh lịch, phù hợp mọi dịp.',
    image: 'https://picsum.photos/280/350?random=13',
    quantity: 95,
    rating: 4.5,
    freshnessDays: 8,
    occasions: ['Đám cưới', 'Tốt nghiệp', 'Cảm ơn'],
    colors: ['Trắng'],
    soldCount: 167,
    createdAt: new Date()
  },

  // Hoa cẩm chướng
  {
    name: 'Cẩm Chướng Đơn Hồng',
    category: 'Hoa cẩm chướng',
    price: 35000,
    description: 'Hoa cẩm chướng đơn màu hồng dịu dàng, thích hợp cho các bó hoa nhỏ xinh.',
    image: 'https://picsum.photos/280/350?random=14',
    quantity: 250,
    rating: 4.3,
    freshnessDays: 12,
    occasions: ['Sinh nhật', 'Thăm hỏi', 'Ngày thường'],
    colors: ['Hồng'],
    soldCount: 289,
    createdAt: new Date()
  },
  {
    name: 'Cẩm Chướng Kép Trắng',
    category: 'Hoa cẩm chướng',
    price: 45000,
    description: 'Hoa cẩm chướng kép trắng bồng bềnh như những đám mây nhỏ, rất đẹp mắt.',
    image: 'https://picsum.photos/280/350?random=15',
    quantity: 180,
    rating: 4.4,
    freshnessDays: 15,
    occasions: ['Đám cưới', 'Trang trí', 'Cúng bái'],
    colors: ['Trắng'],
    soldCount: 234,
    createdAt: new Date()
  },
  {
    name: 'Cẩm Chướng Đỏ Standard',
    category: 'Hoa cẩm chướng',
    price: 40000,
    description: 'Hoa cẩm chướng đỏ chuẩn, màu đỏ đậm đẹp, bền lâu và giá cả phải chăng.',
    image: 'https://picsum.photos/280/350?random=16',
    quantity: 300,
    rating: 4.2,
    freshnessDays: 10,
    occasions: ['Tình yêu', 'Chúc mừng', 'Ngày thường'],
    colors: ['Đỏ'],
    soldCount: 356,
    createdAt: new Date()
  },

  // Hoa đồng tiền
  {
    name: 'Đồng Tiền Tím Purple Rain',
    category: 'Hoa đồng tiền',
    price: 95000,
    description: 'Hoa đồng tiền màu tím mộng mơ, cánh hoa nhiều tầng lớp tạo cảm giác lãng mạn.',
    image: 'https://picsum.photos/280/350?random=17',
    quantity: 75,
    rating: 4.8,
    freshnessDays: 8,
    occasions: ['Tình yêu', 'Sinh nhật', 'Lãng mạn'],
    colors: ['Tím'],
    soldCount: 112,
    createdAt: new Date()
  },
  {
    name: 'Đồng Tiền Trắng Elegance',
    category: 'Hoa đồng tiền',
    price: 85000,
    description: 'Hoa đồng tiền trắng thanh lịch với nhiều cánh hoa mỏng manh, rất đẹp và tinh tế.',
    image: 'https://picsum.photos/280/350?random=18',
    quantity: 90,
    rating: 4.6,
    freshnessDays: 9,
    occasions: ['Đám cưới', 'Trang trí', 'Tốt nghiệp'],
    colors: ['Trắng'],
    soldCount: 98,
    createdAt: new Date()
  },

  // Hoa baby
  {
    name: 'Baby Trắng Tuyết',
    category: 'Hoa baby',
    price: 25000,
    description: 'Hoa baby trắng nhỏ li ti như tuyết rơi, thường dùng để trang trí và kết hợp với hoa khác.',
    image: 'https://picsum.photos/280/350?random=19',
    quantity: 400,
    rating: 4.3,
    freshnessDays: 7,
    occasions: ['Trang trí', 'Đám cưới', 'Phụ trợ'],
    colors: ['Trắng'],
    soldCount: 445,
    createdAt: new Date()
  },
  {
    name: 'Baby Hồng Million Star',
    category: 'Hoa baby',
    price: 30000,
    description: 'Hoa baby hồng million star, hoa nhỏ màu hồng nhạt, tạo điểm nhấn dễ thương cho bó hoa.',
    image: 'https://picsum.photos/280/350?random=20',
    quantity: 350,
    rating: 4.4,
    freshnessDays: 6,
    occasions: ['Sinh nhật', 'Trang trí', 'Phụ trợ'],
    colors: ['Hồng'],
    soldCount: 387,
    createdAt: new Date()
  },

  // Hoa hướng dương
  {
    name: 'Hướng Dương Giant',
    category: 'Hoa hướng dương',
    price: 65000,
    description: 'Hoa hướng dương to đẹp, đầu hoa lớn màu vàng rực rỡ, biểu tượng của sự lạc quan và năng lượng.',
    image: 'https://picsum.photos/280/350?random=21',
    quantity: 80,
    rating: 4.7,
    freshnessDays: 6,
    occasions: ['Chúc mừng', 'Khai trương', 'Khích lệ'],
    colors: ['Vàng'],
    soldCount: 156,
    createdAt: new Date()
  },
  {
    name: 'Hướng Dương Mini Cute',
    category: 'Hoa hướng dương',
    price: 35000,
    description: 'Hoa hướng dương mini nhỏ xinh, đầu hoa vừa phải, thích hợp làm hoa trang trí bàn.',
    image: 'https://picsum.photos/280/350?random=22',
    quantity: 120,
    rating: 4.5,
    freshnessDays: 5,
    occasions: ['Trang trí', 'Sinh nhật', 'Ngày thường'],
    colors: ['Vàng'],
    soldCount: 189,
    createdAt: new Date()
  },

  // Hoa lan
  {
    name: 'Lan Hồ Điệp Trắng',
    category: 'Hoa lan',
    price: 280000,
    description: 'Hoa lan hồ điệp trắng cao cấp, hoa to đẹp dáng vẻ quý phái, bền lâu đến 3-4 tuần.',
    image: 'https://picsum.photos/280/350?random=23',
    quantity: 25,
    rating: 5.0,
    freshnessDays: 25,
    occasions: ['Cao cấp', 'Khai trương', 'Tặng sếp'],
    colors: ['Trắng'],
    soldCount: 45,
    createdAt: new Date()
  },
  {
    name: 'Lan Dendrobium Tím',
    category: 'Hoa lan',
    price: 195000,
    description: 'Hoa lan dendrobium màu tím sang trọng, nhiều bông hoa nhỏ trên một cành, rất đẹp mắt.',
    image: 'https://picsum.photos/280/350?random=24',
    quantity: 40,
    rating: 4.8,
    freshnessDays: 18,
    occasions: ['Sang trọng', 'Tặng quà', 'Trang trí'],
    colors: ['Tím'],
    soldCount: 67,
    createdAt: new Date()
  },

  // Hoa salem
  {
    name: 'Salem Xanh Fresh',
    category: 'Lá salem',
    price: 15000,
    description: 'Lá salem xanh tươi mát, lá to đẹp dùng để làm nền và trang trí cho các bó hoa.',
    image: 'https://picsum.photos/280/350?random=25',
    quantity: 500,
    rating: 4.2,
    freshnessDays: 10,
    occasions: ['Phụ trợ', 'Trang trí', 'Nền'],
    colors: ['Xanh'],
    soldCount: 678,
    createdAt: new Date()
  }
];

// Dữ liệu users mẫu
const users = [
  {
    email: 'customer1@example.com',
    password: '123456', // Sẽ hash bằng bcrypt
    fullName: 'Nguyễn Thị Hoa',
    phone: '0123456789',
    address: '123 Đường Hoa Mai, Quận 1, TP.HCM',
    createdAt: new Date()
  },
  {
    email: 'customer2@example.com',
    password: '123456', // Sẽ hash bằng bcrypt
    fullName: 'Trần Văn Tulip',
    phone: '0987654321',
    address: '456 Đường Hoa Sứ, Quận 3, TP.HCM',
    createdAt: new Date()
  }
];

/**
 * Seed dữ liệu vào MongoDB
 */
async function seedData() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Kết nối MongoDB thành công!');

    const db = client.db(dbName);

    // Xóa dữ liệu cũ (nếu có)
    console.log('🗑️  Xóa dữ liệu cũ...');
    await db.collection('flowers').deleteMany({});
    await db.collection('users').deleteMany({});
    await db.collection('orders').deleteMany({});

    // Hash passwords
    console.log('🔐 Đang hash passwords...');
    for (let user of users) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    // Insert dữ liệu mới
    console.log('🌸 Đang thêm hoa tươi...');
    const flowerResult = await db.collection('flowers').insertMany(flowers);
    console.log(`✅ Đã thêm ${flowerResult.insertedCount} loại hoa`);

    console.log('👤 Đang thêm users...');
    const userResult = await db.collection('users').insertMany(users);
    console.log(`✅ Đã thêm ${userResult.insertedCount} users`);

    // Tạo indexes
    console.log('📑 Đang tạo indexes...');
    await db.collection('flowers').createIndex({ name: 'text', description: 'text' });
    await db.collection('flowers').createIndex({ category: 1 });
    await db.collection('flowers').createIndex({ occasions: 1 });
    await db.collection('flowers').createIndex({ rating: -1 });
    await db.collection('flowers').createIndex({ price: 1 });
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    console.log('✅ Đã tạo indexes');

    console.log('\n🎉 Seed dữ liệu thành công!');
    console.log(`🌺 Tổng số loại hoa: ${flowers.length}`);
    console.log(`👥 Tổng số users: ${users.length}`);
    console.log('\n📝 Thông tin đăng nhập test:');
    console.log('   Email: customer1@example.com');
    console.log('   Password: 123456');
  } catch (error) {
    console.error('❌ Lỗi khi seed dữ liệu:', error);
  } finally {
    await client.close();
    console.log('🔒 Đã đóng kết nối MongoDB');
  }
}

// Chạy seed
seedData();
