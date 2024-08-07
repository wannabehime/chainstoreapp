package com.example.chainstoreapp.service;

import java.util.ArrayList;

import com.example.chainstoreapp.entity.Store;
import com.example.chainstoreapp.form.SearchStoresForm;

// ====== コントローラーのgetStoresで使うサービスのインターフェース ======
public interface StoreService {
	
//	フォームの検索条件から店舗検索
	ArrayList<Store> searchStores(SearchStoresForm searchStoresForm);
}
