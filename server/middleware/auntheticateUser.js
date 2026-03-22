const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const { getSupabaseClient } = require('../supabase');

const client = jwksClient({
  jwksUri: `${process.env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`,
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  requestHeaders: { apikey: process.env.SUPABASE_ANON_KEY },
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    callback(null, key.getPublicKey());
  });
}

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'token não fornecido' });

  const token = authHeader.split(' ')[1];

  jwt.verify(token, getKey, { algorithms: ['ES256'] }, (err, decoded) => {
    if (err) {
      console.error('verificação do token falhou:', err);
      return res.status(401).json({ error: 'token inválido' });
    }

    req.user = { id: decoded.sub };
    req.supabase = getSupabaseClient(token);
    req.token = token;
    next();
  });
};

module.exports = authenticateUser;