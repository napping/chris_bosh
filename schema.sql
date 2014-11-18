CREATE TABLE Users 
(
    username        VARCHAR(20) UNIQUE NOT NULL,
    password        VARCHAR(256),
    email           VARCHAR(256),
    full_name       VARCHAR(256),
    affiliation     VARCHAR(256),
    interests       VARCHAR(256)
);

CREATE TABLE Trip
(
    tid             INT PRIMARY KEY NOT NULL,
    packing_list    VARCHAR(256),
    expenses        VARCHAR(256),
    type            VARCHAR(20) DEFAULT 'Trip',
    CONSTRAINT type_trip CHECK (type = 'Trip'),
    FOREIGN KEY (tid, type) REFERENCES Media(mid, type)
);

CREATE TABLE Destination 
(
    did             INT PRIMARY KEY NOT NULL,
    name            VARCHAR(20),
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

CREATE TABLE Media 
(
    mid             INT,
    type            VARCHAR(20),
    privacy         VARCHAR(20),
    CONSTRAINT pk PRIMARY KEY (mid, type),
    CONSTRAINT type_enum CHECK (type in ('Link', 'Photo', 'Video', 'Trip', 'Destination')),
    CONSTRAINT privacy_enum CHECK (privacy in ('Only Me','Only Friends','Everyone'))
);

CREATE TABLE Link 
(
    lid             INT PRIMARY KEY NOT NULL,
    url             VARCHAR(20),
    type            VARCHAR(20) DEFAULT 'Link',
    CONSTRAINT type_link CHECK (type = 'Link'),
    FOREIGN KEY (lid, type) REFERENCES Media(mid, type)
);

CREATE TABLE Photo 
(
    pid             INT PRIMARY KEY NOT NULL,
    url             VARCHAR(20),
    type            VARCHAR(20) DEFAULT 'Photo',
    CONSTRAINT type_photo CHECK (type = 'Photo'),
    FOREIGN KEY (pid, type) REFERENCES Media(mid, type)
);

CREATE TABLE Video 
(
    vid             INT PRIMARY KEY NOT NULL,
    url             VARCHAR(20),
    type            VARCHAR(20) DEFAULT 'Video',
    CONSTRAINT type_video CHECK (type = 'Video'),
    FOREIGN KEY (vid, type) REFERENCES Media(mid, type)
);

CREATE TABLE NotifiedOf 
(
    nid             INT,
    username        VARCHAR(20),
    FOREIGN KEY (nid) REFERENCES Notification(nid),
    FOREIGN KEY (username) REFERENCES Users(username)
);
    

CREATE TABLE Friendship 
(
    username1            VARCHAR(20),
    username2            VARCHAR(20),
    FOREIGN KEY (username1) REFERENCES Users(username),
    FOREIGN KEY (username2) REFERENCES Users(username)
);

CREATE TABLE GoesOn 
(
    username        VARCHAR(20),
    tid             INT,
    FOREIGN KEY (username) REFERENCES Users(username),
    FOREIGN KEY (tid) REFERENCES Trip(tid)    
);

CREATE TABLE PartOf 
(
    tid             INT,
    did             INT,
    order_in_trip   INT,
    FOREIGN KEY (tid) REFERENCES Trip(tid),
    FOREIGN KEY (did) REFERENCES Destination(did)
);

CREATE TABLE Describes 
(
    hid             INT,
    mid             INT,
    type            VARCHAR(20),
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
    CONSTRAINT type_enum_owns CHECK (type in ('Link', 'Photo', 'Video', 'Trip', 'Destination'))
);

CREATE TABLE Comments
(
    username        VARCHAR(20),
    comment_text    VARCHAR(256),
    mid             INT,
    type            VARCHAR(20),
    FOREIGN KEY (username) REFERENCES Users(username),
    FOREIGN KEY (mid, type) REFERENCES Media(mid, type),
    CONSTRAINT type_enum_comment CHECK (type in ('Link', 'Photo', 'Video', 'Trip', 'Destination'))
);

CREATE TABLE Rating 
(
    username        VARCHAR(20),
    rating          VARCHAR(20),
    mid             INT,
    type            VARCHAR(20),
    FOREIGN KEY (username) REFERENCES Users(username),
    FOREIGN KEY (mid, type) REFERENCES Media(mid, type),
    CONSTRAINT type_enum_rating CHECK (type in ('Link', 'Photo', 'Video', 'Trip', 'Destination')),
    CONSTRAINT rating_enum CHECK (rating in ('Like', 'Dislike'))
);

CREATE TABLE Likes
(
    username        VARCHAR(20),
    mid             INT,
    type            VARCHAR(20),
    FOREIGN KEY (username) REFERENCES Users(username),
    FOREIGN KEY (mid, type) REFERENCES Media(mid, type),
    CONSTRAINT type_enum_like CHECK (type in ('Link', 'Photo', 'Video', 'Trip', 'Destination'))
);

CREATE TABLE DestinationTrip 
(
    did             INT,
    mid             INT,
    type            VARCHAR(20),
    FOREIGN KEY (did) REFERENCES Destination(did),
    FOREIGN KEY (mid, type) REFERENCES Media(mid, type),
    CONSTRAINT type_enum_destinationtrip CHECK (type in ('Link', 'Photo', 'Video', 'Trip', 'Destination'))
);