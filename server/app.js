const express = require('express');
const app = express();

app.use(express.json());


app.use('/carrinho', require('./routes/carrinhoRoutes'));
app.use('/', require('./routes/itensRoutes'));
app.use('/', require('./routes/authRoutes'));


// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Erro interno do servidor';
  res.status(status).json({ error: message });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server executando na porta ${port}`));