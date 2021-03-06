CREATE TABLE Users 
(
    username        VARCHAR(64) PRIMARY KEY NOT NULL,
    password        VARCHAR(256) NOT NULL,
    email           VARCHAR(256) UNIQUE NOT NULL,
    full_name       VARCHAR(256),
    affiliation     VARCHAR(256),
    interests       VARCHAR(256)
);

CREATE TABLE Media 
(
    mid             INT NOT NULL,
    source          VARCHAR(64) DEFAULT 'default',
    type            VARCHAR(64),
    privacy         VARCHAR(40),
    CONSTRAINT pk PRIMARY KEY (mid, source, type),
    CONSTRAINT type_enum CHECK (type in ('Link', 'Photo', 'Video', 'Trip', 'Destination')),
    CONSTRAINT privacy_enum CHECK (privacy in ('private','sharedWithTripMembers','public'))
);

CREATE TABLE Trip
(
    tid             INT NOT NULL,
    source          VARCHAR(64) DEFAULT 'default',
    name            VARCHAR(50) NOT NULL,
    packing_list    VARCHAR(256),
    expenses        VARCHAR(256),
    type            VARCHAR(64) DEFAULT 'Trip',
    CONSTRAINT pk_trip PRIMARY KEY (tid, source),
    CONSTRAINT type_trip CHECK (type = 'Trip'),
    FOREIGN KEY (tid, source, type) REFERENCES Media(mid, source, type)
);

CREATE TABLE Destination 
(
    did             INT NOT NULL,
    source          VARCHAR(64) DEFAULT 'default',
    name            VARCHAR(64) NOT NULL,
    type            VARCHAR(64) DEFAULT 'Destination',
    CONSTRAINT pk_destination PRIMARY KEY (did, source),
    CONSTRAINT type_destination CHECK (type = 'Destination'),
    FOREIGN KEY (did, source, type) REFERENCES Media(mid, source, type)
);

CREATE TABLE Notification 
(
    nid             INT PRIMARY KEY NOT NULL,
    body            VARCHAR(256),
    seen            CHAR(1),
    CONSTRAINT seen_boolean CHECK (seen IN ('T','F'))
);

CREATE TABLE Hashtag 
(
    tag             VARCHAR(64) PRIMARY KEY NOT NULL
);

CREATE TABLE Album
(
    aid             INT NOT NULL,
    source          VARCHAR(64) DEFAULT 'default',
    name            VARCHAR(50),
    privacy         VARCHAR(40),
    CONSTRAINT pk_album PRIMARY KEY (aid, source),
    CONSTRAINT privacy_enum_album CHECK (privacy in ('private','sharedWithTripMembers','public'))
);

CREATE TABLE Link 
(
    lid             INT NOT NULL,
    source          VARCHAR(64) DEFAULT 'default',
    url             VARCHAR(512),
    type            VARCHAR(64) DEFAULT 'Link',
    CONSTRAINT pk_link PRIMARY KEY (lid, source),
    CONSTRAINT type_link CHECK (type = 'Link'),
    FOREIGN KEY (lid, source, type) REFERENCES Media(mid, source, type)
);

CREATE TABLE Photo 
(
    pid             INT NOT NULL,
    source          VARCHAR(64) DEFAULT 'default',
    url             VARCHAR(512),
    type            VARCHAR(64) DEFAULT 'Photo',
    hits            INT DEFAULT 0 NOT NULL,
    CONSTRAINT pk_photo PRIMARY KEY (pid, source),
    CONSTRAINT type_photo CHECK (type = 'Photo'),
    FOREIGN KEY (pid, source, type) REFERENCES Media(mid, source, type)
);

CREATE TABLE Video 
(
    vid             INT NOT NULL,
    source          VARCHAR(64) DEFAULT 'default',
    url             VARCHAR(512),
    type            VARCHAR(64) DEFAULT 'Video',
    CONSTRAINT pk_video PRIMARY KEY (vid, source),
    CONSTRAINT type_video CHECK (type = 'Video'),
    FOREIGN KEY (vid, source, type) REFERENCES Media(mid, source, type)
);

CREATE TABLE NotifiedOf 
(
    nid             INT UNIQUE,
    username        VARCHAR(64),
    FOREIGN KEY (nid) REFERENCES Notification(nid),
    FOREIGN KEY (username) REFERENCES Users(username)
);

CREATE TABLE Friendship 
(
    username1            VARCHAR(64),
    username2            VARCHAR(64),
    CONSTRAINT pk_friendship PRIMARY KEY (username1, username2),
    FOREIGN KEY (username1) REFERENCES Users(username),
    FOREIGN KEY (username2) REFERENCES Users(username)
);

CREATE TABLE GoesOn 
(
    username        VARCHAR(64),
    tid             INT,
    source          VARCHAR(64) DEFAULT 'default',
    CONSTRAINT pk_goeson PRIMARY KEY (username, tid, source),
    FOREIGN KEY (username) REFERENCES Users(username),
    FOREIGN KEY (tid, source) REFERENCES Trip(tid, source)    
);

CREATE TABLE PartOf 
(
    tid             INT,
    did             INT,
    order_in_trip   INT,
    source          VARCHAR(64) DEFAULT 'default',
    CONSTRAINT pk_partof PRIMARY KEY (tid, order_in_trip, source),
    FOREIGN KEY (tid, source) REFERENCES Trip(tid, source),
    FOREIGN KEY (did, source) REFERENCES Destination(did, source)
);

CREATE TABLE Describes 
(
    tag             VARCHAR(64),
    mid             INT,
    type            VARCHAR(64),
    source          VARCHAR(64) DEFAULT 'default',
    CONSTRAINT pk_describes PRIMARY KEY (tag, mid, source, type),
    FOREIGN KEY (tag) REFERENCES Hashtag(tag),
    FOREIGN KEY (mid, source, type) REFERENCES Media(mid, source, type),
    CONSTRAINT type_enum_describes CHECK (type in ('Link', 'Photo', 'Video', 'Trip', 'Destination'))
);

CREATE TABLE Owns 
(
    username        VARCHAR(64),
    mid             INT,
    type            VARCHAR(64),
    source          VARCHAR(64) DEFAULT 'default',
    FOREIGN KEY (username) REFERENCES Users(username),
    FOREIGN KEY (mid, source, type) REFERENCES Media(mid, source, type),
    CONSTRAINT pk_owns PRIMARY KEY (mid, source, type),
    CONSTRAINT type_enum_owns CHECK (type in ('Link', 'Photo', 'Video', 'Trip', 'Destination'))
);

CREATE TABLE Rating 
(
    username        VARCHAR(64),
    rating          INT,
    mid             INT,
    source          VARCHAR(64) DEFAULT 'default',
    type            VARCHAR(64),
    review          VARCHAR(4000),
    FOREIGN KEY (username) REFERENCES Users(username),
    FOREIGN KEY (mid, source, type) REFERENCES Media(mid, source, type),
    CONSTRAINT pk_rating PRIMARY KEY (username, mid, source, type),
    CONSTRAINT type_enum_rating CHECK (type in ('Link', 'Photo', 'Video', 'Trip', 'Destination')),
    CONSTRAINT rating_enum CHECK (rating >= 1 AND rating <= 5)
);

CREATE TABLE RequestTrip
(
    username        VARCHAR(64),
    tid             INT,
    source          VARCHAR(64) DEFAULT 'default',
    CONSTRAINT pk_requesttrip PRIMARY KEY (username, tid, source),
    FOREIGN KEY (username) REFERENCES Users(username),
    FOREIGN KEY (tid, source) REFERENCES Trip(tid, source)
);

CREATE TABLE InviteTrip
(
    username1       VARCHAR(64),
    username2       VARCHAR(64),
    tid             INT,
    source          VARCHAR(64) DEFAULT 'default',
    CONSTRAINT pk_invitetrip PRIMARY KEY (username1, username2, tid, source),
    FOREIGN KEY (username1) REFERENCES Users(username),
    FOREIGN KEY (username2) REFERENCES Users(username),
    FOREIGN KEY (tid, source) REFERENCES Trip(tid, source)
);

CREATE TABLE FriendRequest
(
    requestee   VARCHAR(64),
    requester   VARCHAR(64),
    CONSTRAINT pk_friendrequest PRIMARY KEY (requestee, requester),
    FOREIGN KEY (requestee) REFERENCES Users(username),
    FOREIGN KEY (requester) REFERENCES Users(username)
);

CREATE TABLE InAlbum
(
    aid             INT,
    mid             INT,
    type            VARCHAR(64),
    source          VARCHAR(64) DEFAULT 'default',
    FOREIGN KEY (aid, source) REFERENCES Album(aid, source),
    FOREIGN KEY (mid, source, type) REFERENCES Media(mid, source, type),
    CONSTRAINT pk_inalbum PRIMARY KEY (aid, mid, source),
    CONSTRAINT type_enum_inalbum CHECK (type in ('Photo', 'Video'))
);

CREATE TABLE AlbumOfTrip
(
    aid             INT,
    tid             INT,
    source          VARCHAR(64) DEFAULT 'default',
    CONSTRAINT pk_albumoftrip PRIMARY KEY (aid, tid, source),
    FOREIGN KEY (aid, source) REFERENCES Album(aid, source),
    FOREIGN KEY (tid, source) REFERENCES Trip(tid, source)
);
