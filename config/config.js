var path = require('path');
var root = path.join(__dirname, '..');

module.exports = {
    root: root,
    appRoot: path.join(root, 'app'),
    site: {
        name: 'EIGHT?',
        subtitle: 'Brian Shi and Franzia.'
    },
    cookieSecret: 'BrianShiGotCrossfaded'
};
