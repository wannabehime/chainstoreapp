DROP TABLE IF EXISTS stations;

CREATE TABLE stations(
	id INT NOT NULL AUTO_INCREMENT, 
	station_name VARCHAR(50) NOT NULL, 
	prefecture VARCHAR(4) NOT NULL, 
	address VARCHAR(50) NOT NULL, 
	latitude DOUBLE NOT NULL, 
	longitude DOUBLE NOT NULL,
	PRIMARY KEY (id)
);