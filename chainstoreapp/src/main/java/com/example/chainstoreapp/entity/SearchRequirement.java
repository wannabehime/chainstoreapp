package com.example.chainstoreapp.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchRequirement {
	
//	ブランド名
	private String keyword;
	
//	検索範囲の中心
	private String center;
	
//	現在地の経緯度
	private String nowLatLng;
	
//	検索範囲
	private int radius;
}
