package com.example.chainstoreapp.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

// 松屋メニューのエンティティ
public class Menu {
	
//	ID
	private int id;
	
//	カテゴリー
	private String category;
	
//	商品名
	private String name;
	
//	価格
	private int price;

}
