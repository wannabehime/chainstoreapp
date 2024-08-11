package com.example.chainstoreapp.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // ゲッターやセッターなどを生成
@NoArgsConstructor // デフォルトコンストラクタを生成
@AllArgsConstructor // 全てのフィールドを引数に持つコンストラクタを生成

// メニューのエンティティ
public class Menu {
//	商品名
	private String name;
//	価格
	private int price;
}
