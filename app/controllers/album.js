var album = require('../models/album');
var photo = require('../models/photo');

var _ = require('underscore');

exports.new = function(req, res) {
    return res.render('new_album');
}

exports.create = function(req, res) {
    var name = req.body.name;
    var privacy = req.body.privacy;
    album.create(name, privacy, req.session.username, function(err, aid, name) {
        if (err || !aid) {
            console.log('Could not create album ' + name + '.', err);
            req.flash('error', 'Could not create album.');
            return res.redirect('/');
        }
        console.log('Created album ' + name + ' with aid ' + aid + ' with privacy: ' + privacy + '.');
        return res.redirect('/albums/' + aid);
    });
}

exports.show = function(req, res) {
    var username = req.session.username;
    var aid = req.params.id;
    album.verifyUser(username, aid, function (err, allowed) { 
        if (allowed) { 
            album.load(aid, function(err, album) {
                if (err || !album || album.length === 0) {
                    console.log('Album ' + aid + ' not found.', err);
                    return res.redirect('/');
                }
                photos = [];
                photo.forAlbum(aid, username, function(err, foundPhotos) { 
                    if (err) {
                        console.log('Could not find photos for album ', album.NAME, '.');
                        req.flash('error', 'Could not find photos for album.');
                        return res.redirect('/');
                    }
                    photos = foundPhotos;
                    return res.render('album', {
                        name: album.NAME,
                        aid: album.AID,
                        privacy: album.PRIVACY,
                        photos: photos
                    });
                });
           });
        } else { 
            var backURL = req.header('Referer') || '/';

            console.log("User", username, "is not allowed to view album", aid);
            return res.redirect(backURL);
        }
    });
};

exports.uploadPhoto = function(req, res) { 
    var aid = req.body.aid;
    var privacy = req.body.privacy;
    var url = req.body.url;
    photo.createInAlbum(url, req.session.username, aid, privacy, function (err, pid) {
        if (err || !pid) { 
            console.log('Could not upload photo to album ' + aid + '.', err);
            req.flash('error', 'Could not upload photo to album.');
            return res.redirect('/');
        }
        console.log('Uploaded photo to album ' + aid + '.');
        return res.redirect('/albums/' + aid);
    });
}
