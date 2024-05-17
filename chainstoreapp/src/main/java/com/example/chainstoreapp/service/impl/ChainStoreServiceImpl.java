package com.example.chainstoreapp.service.impl;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.example.chainstoreapp.entity.SearchResult;
import com.example.chainstoreapp.service.ChainStoreService;

@Service
public class ChainStoreServiceImpl implements ChainStoreService {

	@Override
	public ArrayList<SearchResult> searchMenu() {
		
		SearchResult searchResult1 = new SearchResult("松屋 武蔵小金井北口店", 500);
		SearchResult searchResult2 = new SearchResult("松屋 武蔵小金井南口店", 300);
		
		ArrayList<SearchResult> searchResults = new ArrayList<>();
		searchResults.add(searchResult1);
		searchResults.add(searchResult2);
		
		return searchResults;
	}

}
