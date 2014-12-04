exports.index = function(req, res) {
    if (req.user) {
        return res.render('home');
    } else {
        return res.render('splash');
    }
};

exports.login = function(req, res) {
    if (req.user) {
        return res.redirect('/');
    } else {
        return res.render('login');
    }
};

exports.logout = function(req, res) {
    if (!req.user) {
        return res.redirect('/');
    }
    req.logout();
    req.flash('success', 'Logged out successfully!');
    return res.redirect('/');
};
