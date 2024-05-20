package com.example.chainstoreapp.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchResult {
	
//	店舗名
	private String storeName;
	
//	緯度
	private double lat;
//	経度
	private double lng;
	
//	距離（単位：メートル）
//	#TODO: RouteAPIで取得の必要あり
//	private int distance;
	
//	営業中か否か（true: 営業中）
	private boolean open_now;
}
