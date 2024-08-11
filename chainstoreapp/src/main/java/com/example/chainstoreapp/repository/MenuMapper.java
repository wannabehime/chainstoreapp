package com.example.chainstoreapp.repository;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.chainstoreapp.entity.Menu;

@Mapper // MyBatisによる自動実装・コンポーネントとして登録され@Autowiredでインジェクションされる・マッパーファイルのSQLにマッピングされる
public interface MenuMapper {
	
//	------ 既存のテーブルの削除 ------ 
	void dropTmpMainMenuTable();
	void dropTmpSideMenusTable();
	
//	------ 必要なテーブルや変数の準備 ------
	void createTmpMainMenuTable(@Param("tableName") String tableName, @Param("priceLimit") int priceLimit); // メインメニュー1品を選んで保持するテーブルを作成
	int selectMainMenuPrice(); // 選んだメインメニューの価格を取得
	void createTmpSideMenusTable(@Param("tableName") String tableName); // サイドメニューのみを抽出して保持するテーブルを作成
	
//	------ 予算からメイン1品+サイドを取得 ------
	ArrayList<Menu> selectMenusWithinPriceLimit(@Param("priceLimit") int priceLimit, @Param("mainMenuPrice") int mainMenuPrice);
}
