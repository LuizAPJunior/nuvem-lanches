const authService = require('./authService');
const catchAsync = require('../../utils/catchAsync');

// req.body is already validated and stripped by the validate middleware.
exports.cadastrar = catchAsync(async (req, res) => {
  const data = await authService.signUp(req.body);
  res.status(201).json(data);
});

exports.login = catchAsync(async (req, res) => {
  let data;
  try {
    data = await authService.signIn(req.body);
  } catch (error) {
    if (error.code === 'email_not_confirmed') {
      await authService.resendConfirmation(req.body.email);
      return res.status(401).json({
        error: 'Email não confirmado. Um novo email de confirmação foi enviado.',
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