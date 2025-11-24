const express = require('express');
const methodOverride = require('method-override');
const session = require('express-session');
const { secure_pass } = require('./middleware/sessionMidleware');
const {sessionOptions} = require('./utils/sessionConfig');
const { usuarios, inicio,  uploads } = require('./routes');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const revisaoApp = require('./domains/revisao/index.js');
const simuladosApp = require('./domains/simulados/index.js')
const ifQuizApp = require('./domains/IFQuiz/index.js')
const cors = require('cors')
const sharedApp = require('./domains/shared/index.js');

const app = express();
const authLocals = require('./middleware/authLocals');
const Nayahath = require('./logs/ArcanaFlow');
Nayahath.setConfig({ flag: true, time: true, file: true, line: true, entity: true, message: true });
Nayahath.setActive(false);

//! Layouts
app.use(expressLayouts);
app.set('layout', path.join(__dirname, 'views/layouts/main'))
app.use('/assets', express.static(path.join(__dirname, 'editor_markdown/dist/assets')));
//! Bootstrap
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')))





app.use(session(sessionOptions));




app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(process.env.UPLOADS_DIR || '/home/ifvestjc/public_html/uploads'));


app.use(methodOverride('_method'));

app.use(async (req, res, next) => {
    res.locals.currentPage = ''
    next();
});

app.use(authLocals);

app.use('/', inicio);
app.use(secure_pass);
app.use('/usuario', usuarios);
app.use('/professor', simuladosApp);
app.use("/uploads",  uploads) 
app.use("/simulados",  simuladosApp) 
app.use("/revisao", revisaoApp)
app.use('/shared', sharedApp)
app.use("/quiz", ifQuizApp);

app.use(cors({
    origin: [ 'http://localhost:3000']
}))


app.listen(process.env.PORT || 3000
    , () => {
    console.log('Working on port 3000!')
});
module.exports = {app};
