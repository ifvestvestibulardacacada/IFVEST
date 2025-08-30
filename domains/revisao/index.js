// import { createDomainApp } from '../../utils/createDomainApp';
// import path from 'path';
// import bodyParser from 'body-parser';
// import express from 'express';
// import router from './router';
// import expressLayouts from 'express-ejs-layouts';
const { createDomainApp } = require('../../utils/createDomainApp');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const router = require('./router');
const expressLayouts = require('express-ejs-layouts');


const revisaoApp = createDomainApp({
    views: path.join(__dirname, 'views'),
    public: path.join(__dirname, 'public'),
    viewEngine: 'ejs',
    middlewares: [
        bodyParser.json(),
        express.urlencoded({ extended: true }),
        express.json()
    ],
})

revisaoApp.use('/', router);
revisaoApp.use(expressLayouts);
revisaoApp.set('layout', path.join(__dirname, '../../views/layouts/main'))

module.exports = revisaoApp;