"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDomainApp = createDomainApp;
var express_1 = require("express");
var path_1 = require("path");
function createDomainApp(config) {
    var domainApp = (0, express_1.default)();
    domainApp.set("views", path_1.default.resolve(config.views));
    domainApp.set("view engine", config.viewEngine || "ejs");
    if (config.public) {
        domainApp.use(express_1.default.static(path_1.default.resolve(config.public)));
    }
    if (config.middlewares && config.middlewares.length > 0) {
        config.middlewares.forEach(function (mw) { return domainApp.use(mw); });
    }
    return domainApp;
}
