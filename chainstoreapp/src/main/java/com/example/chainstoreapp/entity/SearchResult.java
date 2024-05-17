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
	
//	距離（単位：メートル）
	private int distance;
	
}
