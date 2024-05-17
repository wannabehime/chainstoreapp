package com.example.chainstoreapp.service.impl;

import java.util.ArrayList;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.chainstoreapp.entity.SearchRequirement;
import com.example.chainstoreapp.entity.SearchResult;
import com.example.chainstoreapp.form.ChainStoreForm;
import com.example.chainstoreapp.helper.ChainStoreHelper;
import com.example.chainstoreapp.service.ChainStoreService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChainStoreServiceImpl implements ChainStoreService {

	@Override
	public ArrayList<SearchResult> searchMenu(ChainStoreForm form) {
		
//		RestTemplateのDI
		final RestTemplate restTemplate;
		
//		検索条件をフォームからエンティティへ変換
		SearchRequirement searchReq = ChainStoreHelper.convertSearchReq(form);
		
//		urlのテンプレート
		String url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyBvngfDlCJ3HuSMFjB0jylBTpowN9pb-RQ&keyword={keyword}&location={location}&radius={radius}";
//		検索条件をテンプレートに代入
		String keyword = searchReq.getKeywords();
		
		
		SearchResult searchResult = restTemplate.getForObject(url, SearchResult.class);
		
		return searchResults;
	}

}
