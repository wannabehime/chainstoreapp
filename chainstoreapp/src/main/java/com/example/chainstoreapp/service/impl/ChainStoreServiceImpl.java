package com.example.chainstoreapp.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.chainstoreapp.entity.PlacesAPIResponse;
import com.example.chainstoreapp.entity.PlacesAPIResponse.Result;
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

//		returnするリストを用意
		ArrayList<SearchResult> searchResult = new ArrayList<>();
		
//		JSONからエンティティへの変換
		ObjectMapper mapper = new ObjectMapper();
		try {
//			エンティティにマッピング
			PlacesAPIResponse response = mapper.readValue(body, PlacesAPIResponse.class);
//			検索結果リストの取り出し
			List<Result> results = response.getResults();
			for(int i = 0; i < results.size(); i++) {
				Result result = results.get(i);
				String name = result.getName();
//				#TODO: 松屋の場合、名前が「松屋～店」のみをreturnするリストに格納
				if(name.matches("松屋.*店")) {
					double lat = result.getGeometry().getLocation().getLat();
					double lng = result.getGeometry().getLocation().getLng();
					boolean open_now = result.getOpening_hours().isOpen_now();
					SearchResult searchRes = new SearchResult();
					searchRes.setStoreName(name);
					searchRes.setLat(lat);
					searchRes.setLng(lng);
					searchRes.setOpen_now(open_now);
					searchResult.add(i, searchRes);
				}
			}
		}catch (JsonProcessingException e) {
			e.printStackTrace();
		}
	    return searchResult;
	    
	}

}
