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
    
    
    if (error.code == 'email_not_confirmed') {
      console.log('PLEASE: ',error);
      await authService.resendConfirmation(req.body.email);
      return res.status(401).json({
        error: 'Email não confirmado. Um novo email de confirmação foi enviado.',
      });
    }
    console.log('ERROR AQUI: ', error);
    
    return res.status(401).json({ error: error.message });
  }

 const { session } = data; 
 const token = session.access_token;

 res.cookie('token', token, {
    httpOnly: true,               
    secure: process.env.NODE_ENV === 'production',  
    sameSite: 'lax',              // CSRF protection
    maxAge: 60 * 60 * 1000,       
  })

  res.json({
    message: 'Logado!',
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    user: session.user,
  });
});

exports.logout = async(req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax' })
  return res.json({ ok: true })
}