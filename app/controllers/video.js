var video       = require('../models/video');

exports.show = function (req, res) {
    if (!req.session.username) { 
        return res.redirect('/');
    }

    console.log("Params: ", req.params);
    videos = [];
	video.forUser(req.session.username, function(err, foundVideos) {
		if (err || !videos) {
			console.log("Could not load videos for user", req.session.username, err);
			return res.redirect('/');
		}
        for (var i = 0; i < foundVideos.length; i++) { 
            videos.push({ url: "http://www.youtube.com/embed/" + foundVideos[i].URL + "?autoplay=true" });
        }
        return res.render('videos', {
            videos: videos,
        });
	});
}

exports.create = function (req, res) {
    var username = req.session.username;
    var url = req.body.url;

    url = req.body.url.split("=")[1];

    video.create(url, username, function(err) { 
        if (err) { 
            console.log("Error: Could not create video: ", err);
            return res.redirect(req.header('Referer') || '/');
        } else { 
            console.log("Created video", url);

            return res.redirect("/videos");
        }
    }); 
}
