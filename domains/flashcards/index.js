const { createDomainApp } = require('../../utils/createDomainApp');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const router = require('./router');
const expressLayouts = require('express-ejs-layouts');

const flashcardsApp = createDomainApp({
    views: path.join(__dirname, 'views'),
    public: path.join(__dirname, 'public'),
    viewEngine: 'ejs',
    middlewares: [
        bodyParser.json(),
        express.urlencoded({ extended: true }),
        express.json()
    ],
})

flashcardsApp.use('/', router);
flashcardsApp.use(expressLayouts);
flashcardsApp.set('layout', path.join(__dirname, '../../views/layouts/main'))

module.exports = flashcardsApp;