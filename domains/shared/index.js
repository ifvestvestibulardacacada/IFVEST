const { createDomainApp } = require('../../utils/createDomainApp');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const router = require('./router');
const expressLayouts = require('express-ejs-layouts');

const sharedApp = createDomainApp({
    views: path.join(__dirname, 'views'),
    public: path.join(__dirname, 'public'),
    viewEngine: 'ejs',
    middlewares: [
        bodyParser.json(),
        express.urlencoded({ extended: true }),
        express.json()
    ],
})

sharedApp.use('/', router);
sharedApp.use(expressLayouts);
sharedApp.set('layout', path.join(__dirname, '../../views/layouts/main'))

module.exports = sharedApp;
