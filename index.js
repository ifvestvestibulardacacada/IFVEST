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
const bodyParser = require('body-parser');
const { secure_pass } = require('./middleware/sessionMidleware');
const {sessionOptions} = require('./utils/sessionConfig');
const { usuarios, simulados, inicio, professor, uploads, revisao, flashcards,  dificuldades, area, topicos } = require('./routes');
const path = require('path');


const app = express();




app.use(bodyParser.json());

app.use(session(sessionOptions));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('/home/ifvestjc/public_html/uploads'));


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
app.use('/professor', professor);
app.use("/uploads",  uploads) 
app.use("/simulados",  simulados) 
app.use("/revisao", revisao)
app.use('/flashcards', flashcards);app.use('/dificuldades', dificuldades);
app.use('/areas', area);
app.use('/topicos', topicos);

app.listen(process.env.PORT || 3000, () => {
    console.log('Working on port 3000!')
});

 module.exports = {app};