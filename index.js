// Setting ArcanaFlow On/Off
const Nayahath = require('./logs/ArcanaFlow')
if (Nayahath) {
    Nayahath.setConfig('flag', true)
    Nayahath.setConfig('time', true)
    Nayahath.setConfig('file', true)
    Nayahath.setConfig('line', true)
    Nayahath.setConfig('entity', true)
    Nayahath.setConfig('message', true)

    Nayahath.setActive(false) // ! Alternar se quiser desligar os logs
}


const express = require('express');
const methodOverride = require('method-override');
const session = require('express-session');

const helmet = require('helmet');
const { secure_pass } = require('./middleware/sessionMidleware');
const {sessionOptions, store} = require('./utils/sessionConfig');

const { usuarios, simulados, inicio, professor, uploads, revisao } = require('./routes');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');


const revisaoApp = require('./domains/revisao/index.js');
const simuladosApp = require('./domains/simulados/index.js')
const cors = require('cors')
const sharedApp = require('./domains/shared/index.js');

const app = express();

//! Layouts
app.use(expressLayouts);
app.set('layout', path.join(__dirname, 'views/layouts/main'))

//! Bootstrap
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')))





app.use(session(sessionOptions));

app.use(cors({ origin: 'http://localhost:3000' }))

// app.use(helmet({
//     contentSecurityPolicy: {
//         directives: {
//             defaultSrc: ["'self'"],
//             scriptSrc: [
//                 "'self'",
//                 "'unsafe-inline'",
//                 "'unsafe-eval'",
//                 "https://cdn.jsdelivr.net",
//                 "https://cdnjs.cloudflare.com",
//                 "https://cdn-uicons.flaticon.com",
//                 "https://code.jquery.com",
//                 "https://unpkg.com",
//                 "'self' js/"
//             ],
//             scriptSrcAttr: ["'self'", "'unsafe-inline'"], //
//             styleSrc: [
//                 "'self'",
//                 "'unsafe-inline'",
//                 "https://cdn.jsdelivr.net",
//                 "https://cdnjs.cloudflare.com",
//                 "https://cdn-uicons.flaticon.com",
//                 "https://fonts.googleapis.com"
//             ],
//             fontSrc: [
//                 "'self'",
//                 "https:",
//                 "data:",
//                 "https://fonts.gstatic.com"
//             ],
//             imgSrc: ["'self'", "data:", "https:"],
//             connectSrc: ["'self'"],
//             frameSrc: ["'self'"],
//             objectSrc: ["'none'"],
//             mediaSrc: ["'self'"],
//             workerSrc: ["'self'"],
//             formAction: ["'self'"],
//             frameAncestors: ["'self'"]
//         }
//     },
//     crossOriginEmbedderPolicy: false,
//     crossOriginResourcePolicy: { policy: "cross-origin" }
// }));



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(process.env.UPLOADS_DIR || '/home/ifvestjc/public_html/uploads'));


app.use(methodOverride('_method'));

app.use(async (req, res, next) => {
    res.locals.currentPage = ''
    if (req.method === 'GET') {
        req.session.lastGetUrl = req.originalUrl;
    }
    next();
});

app.use('/', inicio);
app.use(secure_pass);
app.use('/usuario', usuarios);
app.use('/professor', simuladosApp);
app.use("/uploads",  uploads) 
app.use("/simulados",  simuladosApp) 
app.use("/revisao", revisaoApp)
app.use('/shared', sharedApp)




app.listen(process.env.PORT || 3000
    , () => {
    console.log('Working on port 3000!')
});
module.exports = {app};