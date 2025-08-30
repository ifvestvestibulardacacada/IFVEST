"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createDomainApp_1 = require("../../utils/createDomainApp");
var path_1 = require("path");
var body_parser_1 = require("body-parser");
var express_1 = require("express");
var router_1 = require("./router");
var revisaoApp = (0, createDomainApp_1.createDomainApp)({
    views: path_1.default.join(__dirname, 'views'),
    public: path_1.default.join(__dirname, 'public'),
    viewEngine: 'ejs',
    middlewares: [
        body_parser_1.default.json(),
        express_1.default.urlencoded({ extended: true }),
        express_1.default.json()
    ],
});
revisaoApp.use('/', router_1.default);
revisaoApp.set('layout', path_1.default.join(__dirname, '../../views/layouts/main'));
exports.default = revisaoApp;
