package com.example.chainstoreapp.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchResult {
	
//	緯度
	private double lat;
//	経度
	private double lng;
	
//	所要時間
	private String duration;
	
}
