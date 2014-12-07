exports.requireLogin = function (req, res, next) {
    if (!req.session.email) {
        req.flash('error', 'You are not logged in.');
        return res.redirect('/');
    }
    next();
};
