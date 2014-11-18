CREATE TABLE Users 
(
    userid          INT PRIMARY KEY NOT NULL,
    username        VARCHAR(20),
    password        VARCHAR(20)
);

CREATE TABLE Trip 
(
    tid             INT PRIMARY KEY NOT NULL,
    packing_list    VARCHAR(256),
    expenses        VARCHAR(256)
);

CREATE TABLE Destination 
(
    did             INT PRIMARY KEY NOT NULL,
    name            VARCHAR(20)
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
    url             VARCHAR(20) 
);

CREATE TABLE Photo 
(
    pid             INT PRIMARY KEY NOT NULL,
    url             VARCHAR(20)
);

CREATE TABLE Video 
(
    pid             INT PRIMARY KEY NOT NULL,
    url             VARCHAR(20)
);

CREATE TABLE NotifiedOf 
(
    nid             INT,
    userid          INT,
    FOREIGN KEY (nid) REFERENCES Notification(nid),
    FOREIGN KEY (userid) REFERENCES Users(userid)
);
    

CREATE TABLE Friendship 
(
    userid1            INT,
    userid2            INT,
    FOREIGN KEY (userid1) REFERENCES Users(userid),
    FOREIGN KEY (userid2) REFERENCES Users(userid)
);

CREATE TABLE GoesOn 
(
    userid          INT,
    tid             INT,
    FOREIGN KEY (userid) REFERENCES Users(userid),
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
    userid          INT,
    mid             INT,
    type            VARCHAR(20),
    FOREIGN KEY (userid) REFERENCES Users(userid),
    FOREIGN KEY (mid, type) REFERENCES Media(mid, type),
    CONSTRAINT type_enum_owns CHECK (type in ('Link', 'Photo', 'Video', 'Trip', 'Destination'))
);

CREATE TABLE Comments
(
    userid          INT,
    comment_text    VARCHAR(256),
    mid             INT,
    type            VARCHAR(20),
    FOREIGN KEY (userid) REFERENCES Users(userid),
    FOREIGN KEY (mid, type) REFERENCES Media(mid, type),
    CONSTRAINT type_enum_comment CHECK (type in ('Link', 'Photo', 'Video', 'Trip', 'Destination'))
);

CREATE TABLE Rating 
(
    userid          INT,
    rating          VARCHAR(20),
    mid             INT,
    type            VARCHAR(20),
    FOREIGN KEY (userid) REFERENCES Users(userid),
    FOREIGN KEY (mid, type) REFERENCES Media(mid, type),
    CONSTRAINT type_enum_rating CHECK (type in ('Link', 'Photo', 'Video', 'Trip', 'Destination')),
    CONSTRAINT rating_enum CHECK (rating in ('Like', 'Dislike'))
);

CREATE TABLE Likes
(
    userid          INT,
    mid             INT,
    type            VARCHAR(20),
    FOREIGN KEY (userid) REFERENCES Users(userid),
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