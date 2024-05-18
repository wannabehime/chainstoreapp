package com.example.chainstoreapp.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

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
//		テンプレートに代入する検索条件を作成
		Map<String, String> params = new HashMap<>();
		params.put("keyword", searchReq.getKeyword());
//		# TODO: centerは場所の文字列で入力される。緯度経度に直す必要あり
		params.put("location", searchReq.getCenter());
		params.put("radius", String.valueOf(searchReq.getRadius()));
		
		SearchResult searchResult = restTemplate.getForObject(url, SearchResult.class, params);
		
		return searchResult;
	}

}
