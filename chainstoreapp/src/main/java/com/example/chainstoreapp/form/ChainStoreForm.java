package com.example.chainstoreapp.form;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChainStoreForm {
	
//	キーワード
	private String keyword;
	
//	検索範囲の中心
//	#TODO: パラメータは緯度経度
	private String center;
	
//	検索範囲
	private int radius;
	
}
