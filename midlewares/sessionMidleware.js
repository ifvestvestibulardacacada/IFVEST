

const secure_pass = (req, res, next) => {
    if (req.session.login || req.path === '/login') {
        next();
    } else {
        res.redirect('/');
    }
};



module.exports = { secure_pass };


