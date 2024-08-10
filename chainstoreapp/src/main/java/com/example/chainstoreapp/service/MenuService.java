package com.example.chainstoreapp.service;

import java.util.ArrayList;

import com.example.chainstoreapp.entity.Menu;

// ====== コントローラーのgetMenusで使うサービスのインターフェース ======
public interface MenuService {

//	------ ブランド名と予算に合致するメニューを取得 ------
	ArrayList<Menu> getMenus(String brandName, Integer priceLimit);

}
