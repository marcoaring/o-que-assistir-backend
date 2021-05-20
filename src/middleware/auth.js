import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ error: 'Autorização não enviada.' });
  }

  const parts = authHeader.split(' ');

  if (!parts.length === 2) {
    return res.status(401).send({ error: 'Ocorreu um erro com a autenticação.' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ error: 'Autenticação fora do formato.' });
  }

  jwt.verify(token, process.env.AUTHENTICATE_HASH, (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: 'Autenticação inválida.' });
    }

    req.userId = decoded.id;

    return next();
  });
};
