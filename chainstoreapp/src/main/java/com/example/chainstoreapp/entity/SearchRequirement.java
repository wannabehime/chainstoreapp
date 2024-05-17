package com.example.chainstoreapp.entity;

import java.util.ArrayList;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchRequirement {
	
//	キーワード
	private ArrayList<String> keywords;
	
//	検索範囲の中心
	private String center;
	
//	検索範囲
	private int range;
}
