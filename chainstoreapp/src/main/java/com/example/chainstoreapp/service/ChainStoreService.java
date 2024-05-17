package com.example.chainstoreapp.service;

import java.util.ArrayList;

import com.example.chainstoreapp.entity.SearchResult;

public interface ChainStoreService {
	
//	検索条件からメニューを検索
	ArrayList<SearchResult> searchMenu();
}
