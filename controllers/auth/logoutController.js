
const session = require('express-session');
const { Session } = require('../../models/Session');
const { sequelize } = require('../../models/index');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const store = new SequelizeStore({ db: sequelize, tableName: "sessions", model: Session })

exports.LogoutController = async (req, res) => {
    try {
      const sessionID = req.sessionID;
      
      if (!sessionID) {
        return res.redirect('/usuario/login');
      }
  
      store.destroy(sessionID);
      
      res.clearCookie("connect.sid");
      req.session.destroy();
      res.redirect('/usuario/login');
  
    } catch (error) {
      console.error("Erro no logout:", error.message);
      res.status(500).send("Erro interno");
    }
  };