
require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const authMiddleware = require('./middlewares/authMiddleware');
const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3333;


app.use(express.json());

// ROTAS DA API 
app.get('/', (req, res) => {
  res.send('🚀✅ API StyleSync is running! ✅');
});

app.post('/api/products', authMiddleware, async (req, res) => {
  try {
    const { id, name, description, price, imageUrl, category } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Nome e preço são obrigatórios.' });
    }

    const newProduct = await prisma.product.create({
      data: {
        id: id,
        name: name,
        description: description,
        price: Number(price),
        imageUrl: imageUrl,
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


app.get('/api/products/:id', authMiddleware, async (req, res) => {
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


app.patch('/api/products/:id', async (req, res) => {
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
    const { name, phoneNumber, password } = req.body;


    if (!name || !phoneNumber || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        phoneNumber,
        passwordHash, 
      },
    });

    delete newUser.passwordHash;

    return res.status(201).json(newUser);

  } catch (error) {
  
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return res.status(409).json({ error: 'Este número de telefone já está em uso.' }); // 409 Conflict
    }
    console.error("Erro ao registrar usuário:", error);
    return res.status(500).json({ error: 'Não foi possível registrar o usuário.' });
  }
});

// ROTA PARA LOGIN DE USUÁRIO
app.post('/api/auth/login', async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;


    if (!phoneNumber || !password) {
      return res.status(400).json({ error: 'Número de telefone e senha são obrigatórios.' });
    }


    const user = await prisma.user.findUnique({
      where: {
        phoneNumber: phoneNumber,
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

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port http://localhost:${PORT}`);
});