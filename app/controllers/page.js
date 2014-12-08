exports.index = function(req, res) {
    if (req.session.username) {
        // TODO: replace with something more intelligent
        res.redirect('/users/' + req.session.username);
    } else {
        return res.render('splash');
    }
};

exports.login = function(req, res) {
    if (req.session.username) {
        return res.redirect('/');
    } else {
        return res.render('login');
    }
};

exports.register = function(req, res) {
    if (req.session.username) {
        return res.redirect('/');
    } else {
        return res.render('register');
    }
};

exports.logout = function(req, res) {
    if (!req.session.username) {
        return res.redirect('/');
    }
    delete req.session.username;
    req.flash('success', 'Logged out successfully!');
    return res.redirect('/');
};

exports.about = function(req, res) {
    res.render('about');
}
