import express, { Express, RequestHandler } from "express";
import path from "path";

interface DomainConfig {
  views: string;
  viewEngine?: string;
  public?: string;
  middlewares?: RequestHandler[];
}

export function createDomainApp(config: DomainConfig): Express {
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
