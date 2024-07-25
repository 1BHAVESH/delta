-- SHOW TABLES;

CREATE TABLE user(
    id varchar(50) primary key,
    username varchar(50) UNIQUE,
    email varchar(50)  UNIQUE NOT NULL,
    password varchar(50) NOT NULL
);