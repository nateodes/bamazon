DROP DATABASE IF exists bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;


CREATE table products (
	id INTEGER(11) auto_increment NOT null,
    itemName varchar(100) NOT null,
    department varchar(100) NOT null,
	price INTEGER(10) NOT null,
    stock INTEGER(10) NOT null,
    primary key(id)
    
);

CREATE table consumerInfo (
	id INTEGER(11) auto_increment NOT null,
    consumer varchar(100) NOT null,
    address varchar(100) NOT null,
	moneySpent INTEGER(10) NOT null,
    item varchar(100) NOT null,
    primary key(id)
    
);


SELECT*FROM consumerInfo;

SELECT*FROM products;