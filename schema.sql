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
    mid             INT,
    type            VARCHAR(20),
    privacy         VARCHAR(20),
    CONSTRAINT pk PRIMARY KEY (mid, type),
    CONSTRAINT type_enum CHECK (type in ('Link', 'Photo', 'Video', 'Trip', 'Destination')),
    CONSTRAINT privacy_enum CHECK (privacy in ('Only Me','Only Friends','Everyone'))
);

CREATE TABLE Trip
(
    tid             INT PRIMARY KEY NOT NULL,
    name            VARCHAR(50) NOT NULL,
    packing_list    VARCHAR(256),
    expenses        VARCHAR(256),
    type            VARCHAR(20) DEFAULT 'Trip',
    CONSTRAINT type_trip CHECK (type = 'Trip'),
    FOREIGN KEY (tid, type) REFERENCES Media(mid, type)
);

CREATE TABLE Destination 
(
    did             INT PRIMARY KEY NOT NULL,
    name            VARCHAR(20) NOT NULL,
    type            VARCHAR(20) DEFAULT 'Destination',
    CONSTRAINT type_destination CHECK (type = 'Destination'),
    FOREIGN KEY (did, type) REFERENCES Media(mid, type)
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
    hid             INT PRIMARY KEY NOT NULL,
    tag             VARCHAR(20)
);

CREATE TABLE Album
(
    aid             INT PRIMARY KEY NOT NULL,
    name            VARCHAR(50),
    privacy         VARCHAR(20)
);

CREATE TABLE Link 
(
    lid             INT PRIMARY KEY NOT NULL,
    url             VARCHAR(512),
    type            VARCHAR(20) DEFAULT 'Link',
    CONSTRAINT type_link CHECK (type = 'Link'),
    FOREIGN KEY (lid, type) REFERENCES Media(mid, type)
);

CREATE TABLE Photo 
(
    pid             INT PRIMARY KEY NOT NULL,
    url             VARCHAR(512),
    type            VARCHAR(20) DEFAULT 'Photo',
    CONSTRAINT type_photo CHECK (type = 'Photo'),
    FOREIGN KEY (pid, type) REFERENCES Media(mid, type)
);

CREATE TABLE Video 
(
    vid             INT PRIMARY KEY NOT NULL,
    url             VARCHAR(512),
    type            VARCHAR(20) DEFAULT 'Video',
    CONSTRAINT type_video CHECK (type = 'Video'),
    FOREIGN KEY (vid, type) REFERENCES Media(mid, type)
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
    CONSTRAINT pk_goeson PRIMARY KEY (username, tid),
    FOREIGN KEY (username) REFERENCES Users(username),
    FOREIGN KEY (tid) REFERENCES Trip(tid)    
);

CREATE TABLE PartOf 
(
    tid             INT,
    did             INT,
    order_in_trip   INT,
    CONSTRAINT pk_partof PRIMARY KEY (tid, order_in_trip),
    FOREIGN KEY (tid) REFERENCES Trip(tid),
    FOREIGN KEY (did) REFERENCES Destination(did)
);

CREATE TABLE Describes 
(
    hid             INT,
    mid             INT,
    type            VARCHAR(20),
    CONSTRAINT pk_describes PRIMARY KEY (hid, mid, type),
    FOREIGN KEY (hid) REFERENCES Hashtag(hid),
    FOREIGN KEY (mid, type) REFERENCES Media(mid, type),
    CONSTRAINT type_enum_describes CHECK (type in ('Link', 'Photo', 'Video', 'Trip', 'Destination'))
);

CREATE TABLE Owns 
(
    username        VARCHAR(20),
    mid             INT,
    type            VARCHAR(20),
    FOREIGN KEY (username) REFERENCES Users(username),
    FOREIGN KEY (mid, type) REFERENCES Media(mid, type),
    CONSTRAINT pk_owns PRIMARY KEY (mid, type),
    CONSTRAINT type_enum_owns CHECK (type in ('Link', 'Photo', 'Video', 'Trip', 'Destination'))
);

CREATE TABLE Rating 
(
    username        VARCHAR(20),
    rating          INT,
    mid             INT,
    type            VARCHAR(20),
    review          VARCHAR(4000),
    FOREIGN KEY (username) REFERENCES Users(username),
    FOREIGN KEY (mid, type) REFERENCES Media(mid, type),
    CONSTRAINT pk_rating PRIMARY KEY (username, mid, type),
    CONSTRAINT type_enum_rating CHECK (type in ('Link', 'Photo', 'Video', 'Trip', 'Destination')),
    CONSTRAINT rating_enum CHECK (rating >= 1 AND rating <= 5)
);

CREATE TABLE RequestTrip
(
    username        VARCHAR(20),
    tid             INT,
    CONSTRAINT pk_requesttrip PRIMARY KEY (username, tid),
    FOREIGN KEY (username) REFERENCES Users(username),
    FOREIGN KEY (tid) REFERENCES Trip(tid)
);

CREATE TABLE InviteTrip
(
    username        VARCHAR(20),
    tid             INT,
    CONSTRAINT pk_invitetrip PRIMARY KEY (username, tid),
    FOREIGN KEY (username) REFERENCES Users(username),
    FOREIGN KEY (tid) REFERENCES Trip(tid)
);

CREATE TABLE InAlbum
(
    aid             INT,
    mid             INT,
    type            VARCHAR(20),
    FOREIGN KEY (aid) REFERENCES Album(aid),
    FOREIGN KEY (mid, type) REFERENCES Media(mid, type),
    CONSTRAINT pk_inalbum PRIMARY KEY (aid, mid),
    CONSTRAINT type_enum_inalbum CHECK (type in ('Photo', 'Video'))
);

CREATE TABLE AlbumOfTrip
(
    aid             INT,
    tid             INT,
    CONSTRAINT pk_albumoftripg PRIMARY KEY (aid, tid),
    FOREIGN KEY (aid) REFERENCES Album(aid),
    FOREIGN KEY (tid) REFERENCES Trip(tid)
);
