const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { Session } = require('../models/Session');
const { sequelize } = require('../models/index');


const sessionOptions = {
    secret: 'frasealeatoria',
    store: new SequelizeStore({ 
        db: sequelize , 
        tableName: "sessions",
        model: Session,
   
      }),
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
        secure: false // Altere para true se usar HTTPS
    },

};




module.exports = sessionOptions;