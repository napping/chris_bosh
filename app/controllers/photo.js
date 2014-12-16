var photo       = require('../models/photo'),
	user        = require('../models/user'),
	hashtag     = require('../models/hashtag'),
	trip        = require('../models/trip');
    comment     = require('../models/comment');

var _ = require('underscore');

exports.show = function (req, res) {
    var mid = req.params.pid;
    // register that the photo was hit, for caching purposes
    photo.view(mid, function(err, isCached) {
        if (err) {
            console.log('Could not load photo. ', err);
            return res.redirect('/');
        }
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
                            isCached: isCached,
                            pid: req.params.pid, 
                            isOwner: owner == req.session.username,
                            hashtags: hashtags,
                            comments: comments
                        });
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
    if (!url || url.length == 0) {
        req.flash('error', 'Could not create photo.');
        console.log('Photo url cannot be null or empty.');
        return res.redirect(req.header('Referer') || '/');
    }
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
};

exports.cached = function(req, res) {
    var pid = req.params.id;
    photo.fromCache(pid, function (err, photo) {
        if (err) {
            console.log('Could not load cached photo ' + pid + '.', err);
            return res.redirect('/');
        }
        res.writeHead(200, {'Content-Type': 'image/gif' });
        res.end(photo, 'binary');
    });
}
