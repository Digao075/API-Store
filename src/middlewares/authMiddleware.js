const jwt = require('jsonwebtoken');


function authMiddleware(req, res, next) {

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];


  if (token == null) {
    return res.sendStatus(401); 
  }


  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

    if (err) {
      return res.sendStatus(403); 
    }


    if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Acesso negado: rota exclusiva para administradores.'}); // Forbidden
    }


    req.user = user;
    next();
  });
}

module.exports = authMiddleware;