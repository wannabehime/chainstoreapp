package com.example.chainstoreapp.service;

import com.example.chainstoreapp.entity.SearchRequirement;

public interface ChainStoreService {
	
//	検索条件からメニューを検索
	String searchMenu(SearchRequirement searchReq);
}
