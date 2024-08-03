DROP TABLE IF EXISTS stations;
CREATE TABLE stations(
	id INT NOT NULL AUTO_INCREMENT, 
	name VARCHAR(30) NOT NULL,
	company VARCHAR(15) NOT NULL, -- TODO: 不要ならデータとともに消す
	prefecture VARCHAR(4) NOT NULL, -- TODO: 不要ならデータとともに消す
	address VARCHAR(50) NOT NULL, -- TODO: 不要ならデータとともに消す
	latitude DOUBLE NOT NULL,
	longitude DOUBLE NOT NULL,
	PRIMARY KEY (id)
);

DROP TABLE IF EXISTS matsuya_menus;
CREATE TABLE matsuya_menus(
	id INT NOT NULL AUTO_INCREMENT,
	category VARCHAR(5) NOT NULL, 
	name VARCHAR(30) NOT NULL,
	price INT NOT NULL, 
	PRIMARY KEY (id)
);

DROP TABLE IF EXISTS sukiya_menus;
CREATE TABLE sukiya_menus(
	id INT NOT NULL AUTO_INCREMENT,
	category VARCHAR(5) NOT NULL, 
	name VARCHAR(30) NOT NULL,
	price INT NOT NULL, 
	PRIMARY KEY (id)
);

DROP TABLE IF EXISTS yoshinoya_menus;
CREATE TABLE yoshinoya_menus(
	id INT NOT NULL AUTO_INCREMENT,
	category VARCHAR(5) NOT NULL, 
	name VARCHAR(30) NOT NULL,
	price INT NOT NULL, 
	PRIMARY KEY (id)
);

DROP TABLE IF EXISTS hanamaru_menus;
CREATE TABLE hanamaru_menus(
	id INT NOT NULL AUTO_INCREMENT,
	category VARCHAR(5) NOT NULL, 
	name VARCHAR(30) NOT NULL,
	price INT NOT NULL, 
	PRIMARY KEY (id)
);

DROP TABLE IF EXISTS marugame_menus;
CREATE TABLE marugame_menus(
	id INT NOT NULL AUTO_INCREMENT,
	category VARCHAR(5) NOT NULL, 
	name VARCHAR(30) NOT NULL,
	price INT NOT NULL, 
	PRIMARY KEY (id)
);