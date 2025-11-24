// middleware/authLocals.js
const authLocals = (req, res, next) => {
  res.locals.isLoggedIn = !!req.session.login;
  res.locals.userId = req.session.userId || null;
  res.locals.perfilUsuario = req.session.perfil || null;
  res.locals.nomeUsuario = req.session.nomeUsuario || null;
  res.locals.imagemPerfil = req.session.imagemPerfil || null;
  //res.locals.errorMessage = req.session.errorMessage || null;

  // Limpa mensagem de erro após exibir
  //delete req.session.errorMessage;

  next();
};

module.exports = authLocals;