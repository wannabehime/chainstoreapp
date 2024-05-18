package com.example.chainstoreapp.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.chainstoreapp.entity.PlacesAPIResponse;
import com.example.chainstoreapp.entity.SearchRequirement;
import com.example.chainstoreapp.entity.SearchResult;
import com.example.chainstoreapp.service.ChainStoreService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChainStoreServiceImpl implements ChainStoreService {

//	RestTemplateのDI
	private final RestTemplate restTemplate;
	
	public ArrayList<SearchResult> searchMenu(SearchRequirement searchReq) {
		
//		urlのテンプレート
		String url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyBvngfDlCJ3HuSMFjB0jylBTpowN9pb-RQ&language=ja&keyword={keyword}&location={location}&radius={radius}";

//		テンプレートに代入する検索条件を作成
		Map<String, String> params = new HashMap<>();
		params.put("keyword", searchReq.getKeyword());
//		# TODO: centerは場所の文字列で入力される。緯度経度に直す必要あり
//		# TODO: 仮で緯度経度を入れている
		params.put("location", "35.6987769,139.76471");
		params.put("radius", String.valueOf(searchReq.getRadius()));
		
//		APIを利用して結果をJSONで格納
		String body = restTemplate.getForObject(url, String.class, params);
		
//	    確認用
//	    System.out.println(body);
		
//		JSONからエンティティへの変換
		ObjectMapper mapper = new ObjectMapper();
		try {
			PlacesAPIResponse response = mapper.readValue(body, PlacesAPIResponse.class);
		    Object result = /*(*/response.getResults()/*)[0]*/;
//		    確認用
		    String json = mapper.writeValueAsString(result;
		    System.out.println(json);
		}catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		
	    ArrayList<SearchResult> searchResult = new ArrayList<>();
	    return searchResult;

	}

}
