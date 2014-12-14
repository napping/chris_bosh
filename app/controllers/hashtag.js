var hashtag = require('../models/hashtag');

exports.add = function(req, res) {
	var tag = req.body.tag;
	var type = req.body.type;
	var mid = req.body.mid;


    if (tag.length > 2) { 
        if (tag.charAt(0) == "#") { 
            tag = tag.substring(1);
        }

        hashtag.addTag(tag, type, mid, function(err) {   // Will add to both Hashtag and Describes
            if (err) {
                console.log('Could not create/add hashtag', tag, ": ", err);
                req.flash('error', 'Could not create/add hashtag.');
            } else { 
                console.log('Created hashtag', tag, '.');
            }

            if (type == "Photo") { 
                return res.redirect('/photos/' + mid);

            } else if (type == "Trip") { 
                return res.redirect('/trips/' + mid);

            } else if (type == "Destination") { 
                return res.redirect('/destinations/' + mid);

            } else if (type == "Link") { 
                return res.redirect('/links/' + mid);

            } else if (type == "Video") { 
                return res.redirect('/videos/' + mid);

            } else { 
                return res.redirect('/users/' + req.session.username);
            }
        });
    } else { 
        if (type == "Photo") { 
            return res.redirect('/photos/' + mid);

        } else if (type == "Trip") { 
            return res.redirect('/trips/' + mid);

        } else if (type == "Destination") { 
            return res.redirect('/destinations/' + mid);

        } else if (type == "Link") { 
            return res.redirect('/links/' + mid);

        } else if (type == "Video") { 
            return res.redirect('/videos/' + mid);

        } else { 
            return res.redirect('/users/' + req.session.username);
        }
    }
};

exports.show = function(req, res) {
    var tag = req.params.tag;
}

