package com.example.chainstoreapp.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

//検索の中心地入力の際の、サジェストする駅名エンティティ
public class Station {
	
//	ID
	private int id;
	
//	駅名
	private String station_name;
	
//	都道府県
	private String prefecture;
	
//	住所
	private String address;
	
//	緯度
	private double latitude;
//	経度
	private double longitude;

}
