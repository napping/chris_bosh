-----------
-- Users --
-----------
INSERT INTO Users (username, password, email, full_name, affiliation, interests)
VALUES ('PGCB', 'come_on_eileen', 'ted.guenin@gmail.com',
    'Penn Guamanian Cooking Brigade', 'PAC', 'Going to Tanzania!');

INSERT INTO Users (username, password, email, full_name, affiliation, interests)
VALUES ('tfp', 'copabanana', 'tpeterson14143@gmail.com', 'University Toppah',
    'Chicago', 'Going to Chili''s!');

INSERT INTO Users (username, password, email, full_name, affiliation, interests)
VALUES ('masonje', 'kalepa_ta_kala', 'masonje@wharton.upenn.edu', 'Jack Mason',
    'Lambda Chi Alpha', 'Fraternities, ritualism');

INSERT INTO Users (username, password, email, full_name, affiliation, interests)
VALUES ('necordgren', 'Brucie2004', 'penncleeglub@mgail.com', 'N Eric Cordgren',
    'University Choir', 'Bells!');

INSERT INTO Users (username, password, email, full_name, affiliation, interests)
VALUES ('pjmullz', 'stouffer4lyfe', 'mulletsonmullets@paul.paul', 'Paul Mullet',
    'Art Club', '???');

------------------
-- Destinations --
------------------
INSERT INTO Media (mid, type, privacy) VALUES (1, 'Destination', 'Everyone');
INSERT INTO Destination (did, name) VALUES (1, 'Paris, Kentucky');

INSERT INTO Media (mid, type, privacy) VALUES (2, 'Destination', 'Everyone');
INSERT INTO Destination (did, name) VALUES (2, 'Chili''s');

INSERT INTO Media (mid, type, privacy) VALUES (3, 'Destination', 'Everyone');
INSERT INTO Destination (did, name) VALUES (3, 'Guam');

INSERT INTO Media (mid, type, privacy) VALUES (4, 'Destination', 'Everyone');
INSERT INTO Destination (did, name) VALUES (4, 'The Blind Pig');

INSERT INTO Media (mid, type, privacy) VALUES (5, 'Destination', 'Everyone');
INSERT INTO Destination (did, name) VALUES (5, 'Starbucks');

-----------
-- Trips --
-----------

--| trip 1
INSERT INTO Media (mid, type, privacy) VALUES (1, 'Trip', 'Everyone');
INSERT INTO Trip (tid, name, packing_list, expenses) VALUES (1,
    'Director''s Choice', 'Tequila and Croissants', 'About tree fiddy');
INSERT INTO Owns (username, mid, type) VALUES ('tfp', 1, 'Trip');
-- Starbucks
INSERT INTO PartOf (tid, did, order_in_trip) VALUES (1, 5, 1);
-- Chili's
INSERT INTO PartOf (tid, did, order_in_trip) VALUES (1, 2, 2); 

--| trip 2
INSERT INTO Media (mid, type, privacy) VALUES (2, 'Trip', 'Everyone');
INSERT INTO Trip (tid, name, packing_list, expenses) VALUES (2, 'Tand Brip',
    'Sunblock, more sunblock', 'Sunburn Treatment');
INSERT INTO Owns (username, mid, type) VALUES ('PGCB', 2, 'Trip');
-- Guam
INSERT INTO PartOf (tid, did, order_in_trip) VALUES (2, 3, 1); 
-- The Blind Pig
INSERT INTO PartOf (tid, did, order_in_trip) VALUES (2, 4, 2); 
-- Guam
INSERT INTO PartOf (tid, did, order_in_trip) VALUES (2, 3, 3); 

--| trip 3
INSERT INTO Media (mid, type, privacy) VALUES (3, 'Trip', 'Only Friends');
INSERT INTO Trip (tid, name, packing_list, expenses) VALUES (3, 'Hoo Hah!',
    'A guitar', 'I can''t convert into Guamanian currency ):');
INSERT INTO Owns (username, mid, type) VALUES ('necordgren', 3, 'Trip');
INSERT INTO GoesOn (username, tid) VALUES ('PGCB', 3);
-- Guam
INSERT INTO PartOf (tid, did, order_in_trip) VALUES (3, 3, 1); 

--| trip 4
INSERT INTO Media (mid, type, privacy) VALUES (4, 'Trip', 'Everyone');
INSERT INTO Trip (tid, name, packing_list, expenses) VALUES (4,
    'Stouffer Jaunt', 'Banjo, Overalls', 'Practically none');
INSERT INTO Owns (username, mid, type) VALUES ('pjmullz', 4, 'Trip');
-- Paris, Kentucky
INSERT INTO PartOf (tid, did, order_in_trip) VALUES (4, 1, 1);
-- Starbucks
INSERT INTO PartOf (tid, did, order_in_trip) VALUES (4, 5, 2);
-- Guam
INSERT INTO PartOf (tid, did, order_in_trip) VALUES (4, 3, 3);

--| trip 5
INSERT INTO Media (mid, type, privacy) VALUES (5, 'Trip', 'Everyone');
INSERT INTO Trip (tid, name, packing_list, expenses) VALUES (5, 'LXA',
    'I''ve got my red dress on tonight', '$600');
INSERT INTO Owns (username, mid, type) VALUES ('masonje', 5, 'Trip');
-- | Starbucks
INSERT INTO PartOf (tid, did, order_in_trip) VALUES (5, 5, 1);
-- | Starbucks again
INSERT INTO PartOf (tid, did, order_in_trip) VALUES (5, 5, 2);
-- | Starbucks a third time
INSERT INTO PartOf (tid, did, order_in_trip) VALUES (5, 5, 3);
-- | Quick detour to Guam
INSERT INTO PartOf (tid, did, order_in_trip) VALUES (5, 3, 4);
-- | And time to check out Paris, Kentucky
INSERT INTO PartOf (tid, did, order_in_trip) VALUES (5, 1, 5);

------------
-- Albums --
------------

--| album for the first trip
INSERT INTO Album (aid, name, privacy) VALUES (1, 'The Life of TFP',
    'Everyone');
INSERT INTO AlbumOfTrip (aid, tid) VALUES (1, 1);

INSERT INTO Media (mid, type, privacy) VALUES (1, 'Photo', 'Everyone');
INSERT INTO Photo (pid, url) VALUES (1, 'http://www.brinker.com/images/ourstory/Presidente+Margarita+thumb.jpg');
INSERT INTO Owns (username, mid, type) VALUES ('tfp', 1, 'Photo');
INSERT INTO InAlbum (aid, mid, type) VALUES (1, 1, 'Photo');

INSERT INTO Media (mid, type, privacy) VALUES (2, 'Photo', 'Everyone');
INSERT INTO Photo (pid, url) VALUES (2, 'http://img.groundspeak.com/waymarking/display/204eb7bd-14cd6-414145-8360-837cc573f818.JPG');
INSERT INTO Owns (username, mid, type) VALUES ('tfp', 2, 'Photo');
INSERT INTO InAlbum (aid, mid, type) VALUES (1, 2, 'Photo');

INSERT INTO Media (mid, type, privacy) VALUES (3, 'Photo', 'Everyone');
INSERT INTO Photo (pid, url) VALUES (3, 'http://s3-media1.fl.yelpcdn.com/bphoto/ahfqXk0wJ5bph2N73RBs4Q/ls.jpg');
INSERT INTO Owns (username, mid, type) VALUES ('tfp', 3, 'Photo');
INSERT INTO InAlbum (aid, mid, type) VALUES (1, 3, 'Photo');

INSERT INTO Media (mid, type, privacy) VALUES (4, 'Photo', 'Everyone');
INSERT INTO Photo (pid, url) VALUES (4, 'http://www.blogcdn.com/www.dailyfinance.com/media/2013/01/starbucks--435cs013013.jpg');
INSERT INTO Owns (username, mid, type) VALUES ('tfp', 4, 'Photo');
INSERT INTO InAlbum (aid, mid, type) VALUES (1, 4, 'Photo');

INSERT INTO Media (mid, type, privacy) VALUES (5, 'Photo', 'Everyone');
INSERT INTO Photo (pid, url) VALUES (5, 'http://i.imgur.com/ZlJMPm0.jpg');
INSERT INTO Owns (username, mid, type) VALUES ('tfp', 5, 'Photo');
INSERT INTO InAlbum (aid, mid, type) VALUES (1, 5, 'Photo');

--| album for the second trip
INSERT INTO Album (aid, name, privacy) VALUES (2, 'PGCB on Tour',
    'Everyone');
INSERT INTO AlbumOfTrip (aid, tid) VALUES (2, 2);

INSERT INTO Media (mid, type, privacy) VALUES (6, 'Photo', 'Everyone');
INSERT INTO Photo (pid, url) VALUES (6, 'http://www.ocfrealty.com/wp-content/uploads/2011/06/BlindPig1-560x350.jpg');
INSERT INTO Owns (username, mid, type) VALUES ('PGCB', 6, 'Photo');
INSERT INTO InAlbum (aid, mid, type) VALUES (2, 6, 'Photo');

INSERT INTO Media (mid, type, privacy) VALUES (7, 'Photo', 'Everyone');
INSERT INTO Photo (pid, url) VALUES (7, 'http://www.qatar.northwestern.edu/images/carousels/C-Doha.png');
INSERT INTO Owns (username, mid, type) VALUES ('PGCB', 7, 'Photo');
INSERT INTO InAlbum (aid, mid, type) VALUES (2, 7, 'Photo');

INSERT INTO Media (mid, type, privacy) VALUES (8, 'Photo', 'Everyone');
INSERT INTO Photo (pid, url) VALUES (8, 'http://i.imgur.com/jnXMXxs.jpg');
INSERT INTO Owns (username, mid, type) VALUES ('PGCB', 8, 'Photo');
INSERT INTO InAlbum (aid, mid, type) VALUES (2, 8, 'Photo');

INSERT INTO Media (mid, type, privacy) VALUES (9, 'Photo', 'Everyone');
INSERT INTO Photo (pid, url) VALUES (9, 'http://www.kathyloperevents.com/kilimanjaro/images/v031108.jpg');
INSERT INTO Owns (username, mid, type) VALUES ('PGCB', 9, 'Photo');
INSERT INTO InAlbum (aid, mid, type) VALUES (2, 9, 'Photo');

INSERT INTO Media (mid, type, privacy) VALUES (10, 'Photo', 'Everyone');
INSERT INTO Photo (pid, url) VALUES (10, 'http://upload.wikimedia.org/wikipedia/commons/a/ae/Apra_Harbor.jpg');
INSERT INTO Owns (username, mid, type) VALUES ('PGCB', 10, 'Photo');
INSERT INTO InAlbum (aid, mid, type) VALUES (2, 10, 'Photo');

--| album for the third trip
INSERT INTO Album (aid, name, privacy) VALUES (3, 'Nord''s Guamanian Adventures',
    'Everyone');
INSERT INTO AlbumOfTrip (aid, tid) VALUES (3, 3);

INSERT INTO Media (mid, type, privacy) VALUES (11, 'Photo', 'Everyone');
INSERT INTO Photo (pid, url) VALUES (11, 'https://militarytravelexchange.com/blog/wp-content/uploads/2014/03/Guam-Beach.jpg');
INSERT INTO Owns (username, mid, type) VALUES ('necordgren', 11, 'Photo');
INSERT INTO InAlbum (aid, mid, type) VALUES (3, 11, 'Photo');

INSERT INTO Media (mid, type, privacy) VALUES (12, 'Photo', 'Everyone');
INSERT INTO Photo (pid, url) VALUES (12, 'http://www.destination360.com/australia-south-pacific/guam/images/s/guam-overview.jpg');
INSERT INTO Owns (username, mid, type) VALUES ('necordgren', 12, 'Photo');
INSERT INTO InAlbum (aid, mid, type) VALUES (3, 12, 'Photo');

INSERT INTO Media (mid, type, privacy) VALUES (13, 'Photo', 'Everyone');
INSERT INTO Photo (pid, url) VALUES (13, 'http://farm3.static.flickr.com/2271/2334042433_78daa1ebcb.jpg');
INSERT INTO Owns (username, mid, type) VALUES ('necordgren', 13, 'Photo');
INSERT INTO InAlbum (aid, mid, type) VALUES (3, 13, 'Photo');

INSERT INTO Media (mid, type, privacy) VALUES (14, 'Photo', 'Everyone');
INSERT INTO Photo (pid, url) VALUES (14, 'http://i.imgur.com/zk9Oalh.jpg');
INSERT INTO Owns (username, mid, type) VALUES ('necordgren', 14, 'Photo');
INSERT INTO InAlbum (aid, mid, type) VALUES (3, 14, 'Photo');

INSERT INTO Media (mid, type, privacy) VALUES (15, 'Photo', 'Everyone');
INSERT INTO Photo (pid, url) VALUES (15, 'http://i.imgur.com/1nkEy2p.jpg');
INSERT INTO Owns (username, mid, type) VALUES ('necordgren', 15, 'Photo');
INSERT INTO InAlbum (aid, mid, type) VALUES (3, 15, 'Photo');

--| album for the fourth trip
INSERT INTO Album (aid, name, privacy) VALUES (4, 'Stouffer''s Travels',
    'Everyone');
INSERT INTO AlbumOfTrip (aid, tid) VALUES (4, 4);

INSERT INTO Media (mid, type, privacy) VALUES (16, 'Photo', 'Everyone');
INSERT INTO Photo (pid, url) VALUES (16, 'http://s3-media4.fl.yelpcdn.com/bphoto/JWQNaj0AYDmmoNCdxyoA1g/ls.jpg');
INSERT INTO Owns (username, mid, type) VALUES ('pjmullz', 16, 'Photo');
INSERT INTO InAlbum (aid, mid, type) VALUES (4, 16, 'Photo');

INSERT INTO Media (mid, type, privacy) VALUES (17, 'Photo', 'Everyone');
INSERT INTO Photo (pid, url) VALUES (17, 'http://cdn.phillymag.com/wp-content/uploads/2014/06/wawa-robbed-sandwiches-philadelphia.jpg');
INSERT INTO Owns (username, mid, type) VALUES ('pjmullz', 17, 'Photo');
INSERT INTO InAlbum (aid, mid, type) VALUES (4, 17, 'Photo');

INSERT INTO Media (mid, type, privacy) VALUES (18, 'Photo', 'Everyone');
INSERT INTO Photo (pid, url) VALUES (18, 'http://www.facilities.upenn.edu/sites/default/files/styles/maplocation_640x400px/public/bi0555.jpg');
INSERT INTO Owns (username, mid, type) VALUES ('pjmullz', 18, 'Photo');
INSERT INTO InAlbum (aid, mid, type) VALUES (4, 18, 'Photo');

INSERT INTO Media (mid, type, privacy) VALUES (19, 'Photo', 'Everyone');
INSERT INTO Photo (pid, url) VALUES (19, 'http://pennpunch.files.wordpress.com/2011/11/wawa-11.jpg');
INSERT INTO Owns (username, mid, type) VALUES ('pjmullz', 19, 'Photo');
INSERT INTO InAlbum (aid, mid, type) VALUES (4, 19, 'Photo');

INSERT INTO Media (mid, type, privacy) VALUES (20, 'Photo', 'Everyone');
INSERT INTO Photo (pid, url) VALUES (20, 'http://news.regis.org/wp-content/uploads/2013/06/Regis_Graduation.jpg');
INSERT INTO Owns (username, mid, type) VALUES ('pjmullz', 20, 'Photo');
INSERT INTO InAlbum (aid, mid, type) VALUES (4, 20, 'Photo');

--| album for the fifth trip
INSERT INTO Album (aid, name, privacy) VALUES (5, 'Stouffer''s Travels',
    'Everyone');
INSERT INTO AlbumOfTrip (aid, tid) VALUES (5, 5);

INSERT INTO Media (mid, type, privacy) VALUES (21, 'Photo', 'Everyone');
INSERT INTO Photo (pid, url) VALUES (21, 'http://farm1.static.flickr.com/56/151382996_52a5033111_m.jpg');
INSERT INTO Owns (username, mid, type) VALUES ('masonje', 21, 'Photo');
INSERT INTO InAlbum (aid, mid, type) VALUES (5, 21, 'Photo');

INSERT INTO Media (mid, type, privacy) VALUES (22, 'Photo', 'Everyone');
INSERT INTO Photo (pid, url) VALUES (22, 'http://www.lambdachiwjc.org/pictures/lca_house.jpg');
INSERT INTO Owns (username, mid, type) VALUES ('masonje', 22, 'Photo');
INSERT INTO InAlbum (aid, mid, type) VALUES (5, 22, 'Photo');

INSERT INTO Media (mid, type, privacy) VALUES (23, 'Photo', 'Everyone');
INSERT INTO Photo (pid, url) VALUES (23, 'http://upload.wikimedia.org/wikipedia/commons/6/66/Baristas_first_starbucks.jpg');
INSERT INTO Owns (username, mid, type) VALUES ('masonje', 23, 'Photo');
INSERT INTO InAlbum (aid, mid, type) VALUES (5, 23, 'Photo');

INSERT INTO Media (mid, type, privacy) VALUES (24, 'Photo', 'Everyone');
INSERT INTO Photo (pid, url) VALUES (24, 'http://momdoesreviews.katsmediaandmore.netdna-cdn.com/wp-content/uploads/2014/02/chilis_large.jpg');
INSERT INTO Owns (username, mid, type) VALUES ('masonje', 24, 'Photo');
INSERT INTO InAlbum (aid, mid, type) VALUES (5, 24, 'Photo');

INSERT INTO Media (mid, type, privacy) VALUES (25, 'Photo', 'Everyone');
INSERT INTO Photo (pid, url) VALUES (25, 'http://www.kyforward.com/wp-content/uploads/2013/07/Paris-Antiques-Gallery-District-by-Bobby-Shiflet_DSC0714-LR_440.jpg');
INSERT INTO Owns (username, mid, type) VALUES ('masonje', 25, 'Photo');
INSERT INTO InAlbum (aid, mid, type) VALUES (5, 25, 'Photo');
