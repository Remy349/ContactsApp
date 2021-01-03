SHOW DATABASES;

CREATE DATABASE contactsapp;

USE contactsapp;

CREATE TABLE users(
    id INT NOT NULL,
    username VARCHAR(20) NOT NULL,
    password VARCHAR(40) NOT NULL,
    fullname VARCHAR(60) NOT NULL
);

ALTER TABLE users
    ADD PRIMARY KEY (id);

ALTER TABLE users
    MODIFY id INT NOT NULL AUTO_INCREMENT;

DESCRIBE users;

CREATE TABLE contacts(
    id INT NOT NULL,
    contact_name VARCHAR(40) NOT NULL,
    contact_number VARCHAR(15) NOT NULL,
    user_id INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

ALTER TABLE contacts
    ADD PRIMARY KEY (id);

ALTER TABLE contacts
    MODIFY id INT NOT NULL AUTO_INCREMENT;

DESCRIBE contacts;
