const authService = require('../services/authService');
const catchAsync = require('../utils/catchAsync');

exports.cadastrar = catchAsync(async (req, res) => {
  const data = await authService.signUp(req.body);
  res.json(data);
});

exports.login = catchAsync(async (req, res) => {
  let data;
  try {
    data = await authService.signIn(req.body);
  } catch (error) {
    if (error.code === 'email_not_confirmed') {
      await authService.resendConfirmation(req.body.email);
      return res.status(401).json({
        error: 'Email não confirmado, um novo email de confirmação foi enviado.',
      });
    }
    return res.status(401).json({ error: error.message });
  }

  const { session } = data;
  res.json({
    message: 'Logado!',
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    user: session.user,
  });
});

exports.logout = catchAsync(async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log(token);
  
  if (!token){ 
    console.log('are you no here?');
    
    return res.status(401).json({ error: 'token não fornecido' });}

  try {
    await authService.signOut(token);
  } catch (error) {
    if (error.code === 'bad_jwt') return res.status(403).json({ error: 'token inválido' });
    return res.status(401).json({ error: error.message });
  }

  res.json({ message: 'Deslogado!' });
});