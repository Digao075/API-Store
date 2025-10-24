
require('dotenv').config();
const express = require('express');
const { PrismaClient, Prisma } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const authMiddleware = require('./middlewares/authMiddleware');
const prisma = new PrismaClient();
const app = express();
const cors = require('cors');
const upload = require('./config/multerConfig');
const cloudinary = require('./config/cloudinaryConfig');



const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

// ROTAS DA API 
app.get('/', (req, res) => {
  res.send('🚀✅ API StyleSync is running! ✅');
});

app.post('/api/products', authMiddleware, async (req, res) => {
  try {
    const { id, name, description, price, imageUrls, category } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Nome e preço são obrigatórios.' });
    }

    const newProduct = await prisma.product.create({
      data: {
        id: id,
        name: name,
        description: description,
        price: Number(price),
        imageUrls: imageUrls,
        category: category,
      },
    });

    return res.status(201).json(newProduct);

  } catch (error) {
    console.error("Erro ao criar produto:", error);
    return res.status(500).json({ error: 'Não foi possível criar o produto.' });
  }
});

// ROTA PARA LISTAR TODOS OS PRODUTOS
app.get('/api/products', async (req, res) => {
  try {

    const products = await prisma.product.findMany();


    return res.status(200).json(products);

  } catch (error) {

    console.error("Erro ao listar produtos:", error);
    return res.status(500).json({ error: 'Não foi possível listar os produtos.' });
  }
});


app.get('/api/products/:id',  async (req, res) => {
  try {

    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }


    return res.status(200).json(product);

  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    return res.status(500).json({ error: 'Não foi possível buscar o produto.' });
  }
});


app.patch('/api/products/:id', authMiddleware, async (req, res) => {
  try {

    const { id } = req.params;


    const { name, description, price, imageUrl, category } = req.body;


    const updatedProduct = await prisma.product.update({
      where: {
        id: id, 
      },
      data: {
        name, 
        description,
        price: price ? Number(price) : undefined, 
        imageUrl,
        category,
      },
    });

    return res.status(200).json(updatedProduct);

  } catch (error) {
 
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }
    console.error("Erro ao atualizar produto:", error);
    return res.status(500).json({ error: 'Não foi possível atualizar o produto.' });
  }
});

app.delete('/api/products/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;


    await prisma.product.delete({
      where: {
        id: id,
      },
    });


    return res.status(204).send();

  } catch (error) {

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }
    console.error("Erro ao deletar produto:", error);
    return res.status(500).json({ error: 'Não foi possível deletar o produto.' });
  }
});

// --- ROTAS DE AUTENTICAÇÃO ---

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;


    if (!name || !email || !phoneNumber || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phoneNumber,
        passwordHash,
        role: 'CUSTOMER'
      },
    });

const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.status(201).json({ token: token });

  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Email ou telefone já cadastrado.' });
    }
    console.error("Erro no registro:", error);
    return res.status(500).json({ error: 'Não foi possível completar o registro.' });
  }
});

// ROTA PARA LOGIN DE USUÁRIO
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }


    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });


    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' }); 
    }


    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);


    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }


    const token = jwt.sign(
      { 
        userId: user.id, 
        role: user.role 
      }, 
      process.env.JWT_SECRET,        
      { expiresIn: '8h' }          
    );
    

    return res.status(200).json({ token: token });

  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ error: 'Não foi possível fazer o login.' });
  }
});

const requestSpy = (req, res, next) => {
  console.log('--- CABEÇALHOS RECEBIDOS ---');
  console.log(req.headers);
  console.log('---------------------------');
  next();
};

app.post('/api/upload', requestSpy, upload.single('image'), async (req, res) => {
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }

    const uploadPromise = new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'stylesync_products' }, 
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    const result = await uploadPromise;

    return res.status(200).json({ url: result.secure_url });

  } catch (error) {
    console.error('Erro no upload da imagem:', error);
    return res.status(500).json({ error: 'Falha no upload da imagem.' });
  }
});

app.post('/api/orders', async (req, res) => {
  const { cartItems, customerInfo } = req.body;

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ error: 'O carrinho não pode estar vazio.' });
  }

  try {
    const createdOrder = await prisma.$transaction(async (prisma) => {
      let total = 0;
      for (const item of cartItems) {
        const product = await prisma.product.findUnique({ where: { id: item.id } });
        if (!product) throw new Error(`Produto com ID ${item.id} não encontrado.`);
        total += product.price * item.quantity;
      }

      const order = await prisma.order.create({
        data: {
          totalAmount: total,
          // Futuramente, adicionaremos os dados do cliente aqui (nome, endereço, etc.)
        },
      });

      const orderItemsData = cartItems.map(item => ({
        orderId: order.id,
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      await prisma.orderItem.createMany({
        data: orderItemsData,
      });

      return order;
    });

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    res.status(500).json({ error: 'Não foi possível processar o pedido.' });
  }
});

app.post('/api/orders', async (req, res) => {
  const { cartItems, customerInfo } = req.body;

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ error: 'O carrinho não pode estar vazio.' });
  }

  try {
    const createdOrder = await prisma.$transaction(async (prisma) => {
      let total = 0;
      for (const item of cartItems) {
        const product = await prisma.product.findUnique({ where: { id: item.id } });
        if (!product) throw new Error(`Produto com ID ${item.id} não encontrado.`);
        total += product.price * item.quantity;
      }

      const order = await prisma.order.create({
        data: {
          totalAmount: total,
        },
      });


      const orderItemsData = cartItems.map(item => ({
        orderId: order.id,
        productId: item.id,
        quantity: item.quantity,
        price: item.price, 
      }));

      await prisma.orderItem.createMany({
        data: orderItemsData,
      });

      return order;
    });

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    res.status(500).json({ error: 'Não foi possível processar o pedido.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port http://localhost:${PORT}`);
});