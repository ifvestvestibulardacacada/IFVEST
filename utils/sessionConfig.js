const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { Session } = require('../models/Session');
const { sequelize } = require('../models/index');

// Verifica se o modelo Session está definido


// Cria o store
const store = new SequelizeStore({
  db: sequelize,
  tableName: 'sessions',
  model: Session,
});

// Sincroniza o store com o banco
store.sync()

const sessionOptions = {
  secret: 'frasealeatoria',
  store,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    secure: false,
  },
};

module.exports = {
  store,
  sessionOptions,
};