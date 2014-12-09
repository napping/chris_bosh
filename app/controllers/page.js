var db = require('../../config/db'),
    user = require('../models/user'),
    utils = require('./utils');

var _ = require('underscore'),
    ld = require('damerau-levenshtein');

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

exports.search = function(req, res) {
    var query = req.body.query.toLowerCase();
    if (!query) {
        return res.redirect(req.header('Referer') || '/');
    }
    // Does not really make sense to throw this in a model.
    // Do not forget to add to this as we get more functionality working.
    var stmt = 'SELECT T.name AS name, M.mid AS mid, T.type AS type, M.privacy AS privacy, O.username AS owner ' +
        'FROM Trip T INNER JOIN Media M ON M.mid = T.tid AND M.source = T.source AND M.type=T.type ' +
        'INNER JOIN Owns O ON M.mid = O.mid AND M.source = O.source AND M.type = O.type UNION ' +
        'SELECT D.name AS name, M.mid AS mid, D.type AS type, M.privacy AS privacy, O.username AS owner ' +
        'FROM Destination D INNER JOIN Media M ON M.mid = D.did AND M.source = D.source AND M.type = D.type ' +
        'INNER JOIN Owns O ON M.mid = O.mid AND M.source = O.source AND M.type = O.type';
    db.connection.execute(stmt, [], function(err, results) {
        if (err) {
            console.log('Error in search query ' + query + '.', err);
            return res.redirect(req.header('Referer') || '/');
        }

        user.friends(req.session.username || '', function(err, friends) {
            if (err) {
                console.log('Could not make friends call.', err);
                return res.redirect(req.header('Referer') || '/');
            }
            var visibleResults = utils.privacy(results, req.session.username || '', friends);
            var searchResults = _.first(_.sortBy(visibleResults, function(r) {return -ld(query, 
                r.NAME.toLowerCase()).similarity}), 10);

            return res.render('search', {
                results: searchResults
            });
        });
    });
}