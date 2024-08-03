package com.example.chainstoreapp.form;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // ゲッターやセッターなどを生成
@NoArgsConstructor // デフォルトコンストラクタを生成
@AllArgsConstructor // 全てのフィールドを引数に持つコンストラクタを生成

// 店舗検索フォームの情報をコントローラーに渡すForm
public class SearchStoresForm {
//	フィールド名と一致するnameの値を格納
	
//	ブランド名
	private String brandName;
//	検索範囲の中心
	private String center;
//	現在地の経緯度
	private String currentLatLng;
}
