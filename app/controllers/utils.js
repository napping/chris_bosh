var _ = require('underscore');

exports.privacy = function(results, curUser, friends) {
	var visible = [];
	var curUser = curUser.toLowerCase();
    friends = _.map(friends, function(f) { return f.USERNAME.toLowerCase(); });

    for (var i = 0; i < results.length; i++) {
        if (results[i].PRIVACY === 'public') {
            visible.push(results[i]);

        } else if (results[i].PRIVACY === 'sharedWithTripMembers' && 
            (friends.indexOf(curUser) !== -1 || curUser === results[i].OWNER.toLowerCase())) {
            visible.push(results[i]);

        } else if (results[i].PRIVACY === 'private' && curUser === results[i].OWNER.toLowerCase()) {
            visible.push(results[i]);
        }
    }
    return visible;
}