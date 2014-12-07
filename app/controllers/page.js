exports.index = function(req, res) {
    if (req.session.username) {
        return res.render('user');
    } else {
        return res.render('splash');
    }
    console.log("Home");
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

// TODO Testing
exports.testHome = function (req, res) { 
    return res.render('home');
}

exports.testUser = function (req, res) { 
    return res.render('user', { loggedIn: 1 } );
}
