package com.example.chainstoreapp.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // ゲッターやセッターなどを生成
@NoArgsConstructor // デフォルトコンストラクタを生成
@AllArgsConstructor // 全てのフィールドを引数に持つコンストラクタを生成

// 駅のエンティティ
public class Station {
//	駅名
	private String name;
//	緯度
	private double latitude;
//	経度
	private double longitude;
}
