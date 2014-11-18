-----------
-- Users --
-----------
INSERT INTO Users (username, password, email, full_name, affiliation, interests)
VALUES ('PGCB', 'come_on_eileen', 'ted.guenin@gmail.com',
    'Penn Guamanian Cooking Brigade', 'PAC', 'Going to Tanzania!');

INSERT INTO Users (username, password, email, full_name, affiliation, interests)
VALUES ('tfp', 'copabanana', 'tpeterson993@gmail.com', 'University Toppah',
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
INSERT INTO MEDIA (mid, type, privacy) VALUES (1, 'Trip', 'Everyone');
INSERT INTO Trip (tid, packing_list, expenses) VALUES (1,
    'Tequila and Croissants', 'About tree fiddy');
INSERT INTO Owns (username, mid, type) VALUES ('tfp', 1, 'Trip');
-- Starbucks
INSERT INTO PartOf (tid, did, order_in_trip) VALUES (1, 5, 1);
-- Chili's
INSERT INTO PartOf (tid, did, order_in_trip) VALUES (1, 2, 2); 

--| trip 2
INSERT INTO MEDIA (mid, type, privacy) VALUES (2, 'Trip', 'Everyone');
INSERT INTO Trip (tid, packing_list, expenses) VALUES (2,
    'Sunblock, more sunblock', 'Sunburn Treatment');
INSERT INTO Owns (username, mid, type) VALUES ('PGCB', 2, 'Trip');
-- Guam
INSERT INTO PartOf (tid, did, order_in_trip) VALUES (2, 3, 1); 
-- The Blind Pig
INSERT INTO PartOf (tid, did, order_in_trip) VALUES (2, 4, 2); 
-- Guam
INSERT INTO PartOf (tid, did, order_in_trip) VALUES (2, 3, 3); 

--| trip 3
INSERT INTO MEDIA (mid, type, privacy) VALUES (3, 'Trip', 'Only Friends');
INSERT INTO Trip (tid, packing_list, expenses) VALUES (3,
    'A guitar', 'I can''t convert into Guamanian currency ):');
INSERT INTO Owns (username, mid, type) VALUES ('necordgren', 3, 'Trip');
INSERT INTO GoesOn (username, tid) VALUES ('PGCB', 3);
-- Guam
INSERT INTO PartOf (tid, did, order_in_trip) VALUES (3, 3, 1); 
