DROP TABLE IF EXISTS stations;

CREATE TABLE chainstoreapp.stations (
	id INT NOT NULL AUTO_INCREMENT, --id:主キー
	station_name VARCHAR(50) NOT NULL, --駅名
	prefecture VARCHAR(4) NOT NULL, --都道府県名
	address VARCHAR(50) NOT NULL, --住所
	latitude DOUBLE NOT NULL, --緯度
	longitude DOUBLE NOT NULL, --経度
	PRIMARY KEY (id)
	);