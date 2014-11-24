CREATE TABLE Users 
(
    username        VARCHAR(20) PRIMARY KEY NOT NULL,
    password        VARCHAR(256) NOT NULL,
    email           VARCHAR(256) UNIQUE NOT NULL,
    full_name       VARCHAR(256),
    affiliation     VARCHAR(256),
    interests       VARCHAR(256)
);

CREATE TABLE Media 
(
    mid             INT NOT NULL,
    group           VARCHAR(20) NOT NULL DEFAULT 'default',
    type            VARCHAR(20),
    privacy         VARCHAR(20),
    CONSTRAINT pk PRIMARY KEY (mid, group, type),
    CONSTRAINT type_enum CHECK (type in ('Link', 'Photo', 'Video', 'Trip', 'Destination')),
    CONSTRAINT privacy_enum CHECK (privacy in ('private','sharedWithTripMembers','public'))
);

CREATE TABLE Trip
(
    tid             INT NOT NULL,
    group           VARCHAR(20) NOT NULL DEFAULT 'default',
    name            VARCHAR(50) NOT NULL,
    packing_list    VARCHAR(256),
    expenses        VARCHAR(256),
    type            VARCHAR(20) DEFAULT 'Trip',
    CONSTRAINT pk_trip PRIMARY KEY (tid, group),
    CONSTRAINT type_trip CHECK (type = 'Trip'),
    FOREIGN KEY (tid, group, type) REFERENCES Media(mid, group type)
);

CREATE TABLE Destination 
(
    did             INT NOT NULL,
    group           VARCHAR(20) NOT NULL DEFAULT 'default',
    name            VARCHAR(20) NOT NULL,
    type            VARCHAR(20) DEFAULT 'Destination',
    CONSTRAINT pk_destination PRIMARY KEY (did, group),
    CONSTRAINT type_destination CHECK (type = 'Destination'),
    FOREIGN KEY (did, group, type) REFERENCES Media(mid, gropu, type)
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
    tag             VARCHAR(20) PRIMARY KEY NOT NULL
);

CREATE TABLE Album
(
    aid             INT NOT NULL,
    group           VARCHAR(20) NOT NULL DEFAULT 'default',
    name            VARCHAR(50),
    privacy         VARCHAR(20),
    CONSTRAINT pk_album PRIMARY KEY (aid, group)
);

CREATE TABLE Link 
(
    lid             INT NOT NULL,
    group           VARCHAR(20) NOT NULL DEFAULT 'default',
    url             VARCHAR(512),
    type            VARCHAR(20) DEFAULT 'Link',
    CONSTRAINT pk_link PRIMARY KEY (lid, group),
    CONSTRAINT type_link CHECK (type = 'Link'),
    FOREIGN KEY (lid, group, type) REFERENCES Media(mid, group, type)
);

CREATE TABLE Photo 
(
    pid             INT NOT NULL,
    group           VARCHAR(20) NOT NULL DEFAULT 'default',
    url             VARCHAR(512),
    type            VARCHAR(20) DEFAULT 'Photo',
    CONSTRAINT pk_photo PRIMARY KEY (pid, group),
    CONSTRAINT type_photo CHECK (type = 'Photo'),
    FOREIGN KEY (pid, group, type) REFERENCES Media(mid, group, type)
);

CREATE TABLE Video 
(
    vid             INT NOT NULL,
    group           VARCHAR(20) NOT NULL DEFAULT 'default',
    url             VARCHAR(512),
    type            VARCHAR(20) DEFAULT 'Video',
    CONSTRAINT pk_video PRIMARY KEY (vid, group),
    CONSTRAINT type_video CHECK (type = 'Video'),
    FOREIGN KEY (vid, group, type) REFERENCES Media(mid, group, type)
);

CREATE TABLE NotifiedOf 
(
    nid             INT UNIQUE,
    username        VARCHAR(20),
    FOREIGN KEY (nid) REFERENCES Notification(nid),
    FOREIGN KEY (username) REFERENCES Users(username)
);

CREATE TABLE Friendship 
(
    username1            VARCHAR(20),
    username2            VARCHAR(20),
    CONSTRAINT pk_friendship PRIMARY KEY (username1, username2),
    FOREIGN KEY (username1) REFERENCES Users(username),
    FOREIGN KEY (username2) REFERENCES Users(username)
);

CREATE TABLE GoesOn 
(
    username        VARCHAR(20),
    tid             INT,
    group           VARCHAR(20) NOT NULL DEFAULT 'default',
    CONSTRAINT pk_goeson PRIMARY KEY (username, tid, group),
    FOREIGN KEY (username) REFERENCES Users(username),
    FOREIGN KEY (tid, group) REFERENCES Trip(tid, group)    
);

CREATE TABLE PartOf 
(
    tid             INT,
    did             INT,
    order_in_trip   INT,
    group           VARCHAR(20) NOT NULL DEFAULT 'default',
    CONSTRAINT pk_partof PRIMARY KEY (tid, order_in_trip, group),
    FOREIGN KEY (tid, group) REFERENCES Trip(tid, group),
    FOREIGN KEY (did, group) REFERENCES Destination(did, group)
);

CREATE TABLE Describes 
(
    tag             VARCHAR(20),
    mid             INT,
    type            VARCHAR(20),
    group           VARCHAR(20) NOT NULL DEFAULT 'default',
    CONSTRAINT pk_describes PRIMARY KEY (tag, mid, group, type),
    FOREIGN KEY (tag) REFERENCES Hashtag(tag),
    FOREIGN KEY (mid, group, type) REFERENCES Media(mid, group, type),
    CONSTRAINT type_enum_describes CHECK (type in ('Link', 'Photo', 'Video', 'Trip', 'Destination'))
);

CREATE TABLE Owns 
(
    username        VARCHAR(20),
    mid             INT,
    type            VARCHAR(20),
    group           VARCHAR(20) NOT NULL DEFAULT 'default',
    FOREIGN KEY (username) REFERENCES Users(username),
    FOREIGN KEY (mid, group, type) REFERENCES Media(mid, group, type),
    CONSTRAINT pk_owns PRIMARY KEY (mid, group, type),
    CONSTRAINT type_enum_owns CHECK (type in ('Link', 'Photo', 'Video', 'Trip', 'Destination'))
);

CREATE TABLE Rating 
(
    username        VARCHAR(20),
    rating          INT,
    mid             INT,
    group           VARCHAR(20) NOT NULL DEFAULT 'default',
    type            VARCHAR(20),
    review          VARCHAR(4000),
    FOREIGN KEY (username) REFERENCES Users(username),
    FOREIGN KEY (mid, group, type) REFERENCES Media(mid, group, type),
    CONSTRAINT pk_rating PRIMARY KEY (username, mid, group, type),
    CONSTRAINT type_enum_rating CHECK (type in ('Link', 'Photo', 'Video', 'Trip', 'Destination')),
    CONSTRAINT rating_enum CHECK (rating >= 1 AND rating <= 5)
);

CREATE TABLE RequestTrip
(
    username        VARCHAR(20),
    tid             INT,
    group           VARCHAR(20) NOT NULL DEFAULT 'default',
    CONSTRAINT pk_requesttrip PRIMARY KEY (username, tid, group,
    FOREIGN KEY (username) REFERENCES Users(username),
    FOREIGN KEY (tid, group) REFERENCES Trip(tid, group)
);

CREATE TABLE InviteTrip
(
    username1       VARCHAR(20),
    username2       VARCHAR(20),
    tid             INT,
    group           VARCHAR(20) NOT NULL DEFAULT 'default',
    CONSTRAINT pk_invitetrip PRIMARY KEY (username1, username2, tid, group),
    FOREIGN KEY (username1) REFERENCES Users(username),
    FOREIGN KEY (username2) REFERENCES Users(username),
    FOREIGN KEY (tid, group) REFERENCES Trip(tid, group)
);

CREATE TABLE InAlbum
(
    aid             INT,
    mid             INT,
    type            VARCHAR(20),
    group           VARCHAR(20) NOT NULL DEFAULT 'default',
    FOREIGN KEY (aid, group) REFERENCES Album(aid, group),
    FOREIGN KEY (mid, group, type) REFERENCES Media(mid, group, type),
    CONSTRAINT pk_inalbum PRIMARY KEY (aid, mid, group),
    CONSTRAINT type_enum_inalbum CHECK (type in ('Photo', 'Video'))
);

CREATE TABLE AlbumOfTrip
(
    aid             INT,
    tid             INT,
    group           VARCHAR(20) NOT NULL DEFAULT 'default',
    CONSTRAINT pk_albumoftrip PRIMARY KEY (aid, tid, group),
    FOREIGN KEY (aid, group) REFERENCES Album(aid, group),
    FOREIGN KEY (tid, group) REFERENCES Trip(tid, group)
);
