package com.example.chainstoreapp.service;

import com.example.chainstoreapp.form.SearchStoresForm;

// ====== コントローラーのgetStoresで使うサービスのインターフェース ======
public interface StoreService {
	
//	フォームの検索条件から店舗検索
	String searchStores(SearchStoresForm searchStoresForm);
}
