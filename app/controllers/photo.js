var photo       = require('../models/photo'),
	user        = require('../models/user'),
	hashtag     = require('../models/hashtag'),
	trip        = require('../models/trip'),
    comment     = require('../models/comment');

var _ = require('underscore');

exports.show = function (req, res) {
    var mid = req.params.pid;
    photo.getUrlByID(mid, function (err, url) {
		if (err || !url) {
			console.log('Could not find photo.', err);
			req.flash('error', 'Could not find photo.');
			return res.redirect('/');
		}
        photo.getOwner(mid, function (err, owner) {
            if (err || !owner) { 
                console.log('Could not get owner', err);
                req.flash('error', 'Could not get owner.');
                return res.redirect('/');
            }
            comment.forPhoto(mid, function(err, comments) {
                if (err || !comments) {
                    console.log('Could not load comments and ratings for photo ' +
                        mid + '.', err);
                    return res.redirect('/');
                }

                var hashtags = [];
                hashtag.getAllByMedia(mid, function (err, receivedHashtags) { 
                    if (err) { 
                        console.log("Could not get hashtags", mid);
                        return res.redirect('/');
                    } 

                    if (receivedHashtags && receivedHashtags.length > 0) { 
                        hashtags = receivedHashtags;
                    }

                    return res.render( "photo", { 
                        url: url, 
                        pid: req.params.pid, 
                        isOwner: owner == req.session.username,
                        hashtags: hashtags,
                        comments: comments
                    });
                });
            });
        });
    });
}

exports.new = function(req, res) {
	return res.render('new_photo');
}

exports.create = function(req, res) {
	var url = req.body.url;
	photo.create(url, req.session.username, function(err, pid, url) {
		if (err || !pid) {
			console.log('Could not create photo.', err);
			req.flash('error', 'Could not create photo.');
			return res.redirect('/');
		}
		console.log('Created photo.');
		return res.redirect('/photos/' + pid);
	});
};

// Not used, method was moved to controller/user.js
exports.showUserPhotos = function (req, res) {
    console.log("Params: ", req.params);
	photo.forUser(req.params.username, function(err, photos) {
		if (err || !destination || destination.length === 0) {
			console.log('Destination ' + req.params.id + ' not found.', err);
			return res.redirect('/');
		}

        return res.render('destination', {
            photos: photos
        });
	});
}

exports.comment = function(req, res) {
    if (req.session.username) {
        return res.render('photo_comment', {
            id: req.params.id
        });
    } else {
        return res.redirect('/photos/' + req.params.id);
    }
}

exports.addComment = function(req, res) {
    var username = req.session.username.toLowerCase();
    var pid = req.params.id;
    var review = req.body.review;
    var rating = req.body.rating;
    comment.create(username, pid, 'Photo', review, rating, function(wasSuccessful) {
        if (!wasSuccessful) {
            console.log(username + ' could not leave comment for photo ' + pid + '.');
        }
        return res.redirect('/photos/' + pid);
    });
}
