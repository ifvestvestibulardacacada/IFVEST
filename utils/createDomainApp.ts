const express = require('express');
const { Express, RequestHandler } = require('express')
const path = require('path');

interface DomainConfig {
  views: string;
  viewEngine?: string;
  public?: string;
  middlewares?: RequestHandler[];
}

function createDomainApp(config: DomainConfig): Express {
  const domainApp = express();

  domainApp.set("views", path.resolve(config.views));
  domainApp.set("view engine", config.viewEngine || "ejs");

  if (config.public) {
    domainApp.use(express.static(path.resolve(config.public)));
  }

  if (config.middlewares && config.middlewares.length > 0) {
    config.middlewares.forEach(mw => domainApp.use(mw));
  }

  return domainApp;
}

module.exports = {
  createDomainApp
}
