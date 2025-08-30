var express = require('express');
var _a = require('express'), Express = _a.Express, RequestHandler = _a.RequestHandler;
var path = require('path');
function createDomainApp(config) {
    var domainApp = express();
    domainApp.set("views", path.resolve(config.views));
    domainApp.set("view engine", config.viewEngine || "ejs");
    if (config.public) {
        domainApp.use(express.static(path.resolve(config.public)));
    }
    if (config.middlewares && config.middlewares.length > 0) {
        config.middlewares.forEach(function (mw) { return domainApp.use(mw); });
    }
    return domainApp;
}
module.exports = {
    createDomainApp: createDomainApp
};
