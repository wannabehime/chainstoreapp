package com.example.chainstoreapp.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // ゲッターやセッターなどを生成
@NoArgsConstructor // デフォルトコンストラクタを生成
@AllArgsConstructor // 全てのフィールドを引数に持つコンストラクタを生成

//	店舗のエンティティ
public class Store {
//	緯度
	private double latitude;
//	経度
	private double longitude;
//	所要時間
	private String duration;
}
