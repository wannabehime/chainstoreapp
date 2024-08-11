package com.example.chainstoreapp.service.impl;

import java.util.ArrayList;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.chainstoreapp.entity.Menu;
import com.example.chainstoreapp.repository.MenuMapper;
import com.example.chainstoreapp.service.MenuService;

import lombok.RequiredArgsConstructor;

@Service // ビジネスロジックに付与する、インスタンス生成アノテーション
@Transactional // トランザクション管理。更新処理を含むサービスに付与
@RequiredArgsConstructor // finalが付けられたフィールドを引数とするコンストラクタを自動生成。かつ、コンストラクタが1つのみのとき、DIでインスタンスを受け取るコンストラクタを示す@Autowiredを省略可

//====== コントローラーのgetMenusで使うサービス ======
public class MenuServiceImpl implements MenuService {
	
//	MapperのDI
	private final MenuMapper menuMapper;
	
	@Override
//	------ ブランド名と予算に合致するメニューを取得 ------
	public ArrayList<Menu> getMenus(String brandName, Integer priceLimit) {
		
		String tableName = switch (brandName){ // ブランド名から、メニューを取得するテーブル名に変換
			case "松屋" -> "matsuya_menus";
			case "すき家" -> "sukiya_menus";
			case "吉野家" -> "yoshinoya_menus";
			case "はなまるうどん" -> "hanamaru_menus";
			default -> "marugame_menus";
		};
		
//		------ 既存のテーブルの削除 ------ 
		menuMapper.dropTmpMainMenuTable();
		menuMapper.dropTmpSideMenusTable();
		
//		------ 必要なテーブルや変数の準備 ------
		menuMapper.createTmpMainMenuTable(tableName, priceLimit); // メインメニュー1品を選んで保持するテーブルを作成
		int mainMenuPrice = menuMapper.selectMainMenuPrice(); // 選んだメインメニューの価格を取得
		menuMapper.createTmpSideMenusTable(tableName); // サイドメニューのみを抽出して保持するテーブルを作成
		
//		------ 予算からメイン1品+サイドを取得 ------
		return menuMapper.selectMenusWithinPriceLimit(priceLimit, mainMenuPrice);
	}

}
