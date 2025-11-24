const { createDomainApp } = require('../../utils/createDomainApp'); 
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const router = require('./router'); 
const expressLayouts = require('express-ejs-layouts');


const ifQuizApp = createDomainApp({
    views: path.join(__dirname, 'views'),     // Aponta para IFQuiz/views
    public: path.join(__dirname, 'public'),   // Aponta para IFQuiz/public
    viewEngine: 'ejs',
    middlewares: [
        bodyParser.json(),
        express.urlencoded({ extended: true }),
        express.json()
    ],
})

ifQuizApp.use('/', router); 
ifQuizApp.use(expressLayouts);

ifQuizApp.set('layout', path.join(__dirname, '../../views/layouts/main'))

module.exports = ifQuizApp;