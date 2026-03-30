const express = require('express');
const cors = require('cors');
const cookieParser = require ('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.ALLOWED_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan('combined'));

app.use('/me/perfil', require('./modules/perfil/perfilRoutes'));
app.use('/me/pedidos/historico', require('./modules/historico/historicoRoutes'));
app.use('/pedidos', require('./modules/pedidos/pedidosRoutes'));
app.use('/carrinho', require('./modules/carrinho/carrinhoRoutes'));
app.use('/itens', require('./modules/itens/itensRoute'));
app.use('/auth', require('./modules/auth/authRoutes'));


// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Erro interno do servidor';
  res.status(status).json({ error: message });
});

module.exports = app;