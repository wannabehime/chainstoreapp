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
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChainStoreServiceImpl implements ChainStoreService {

//	RestTemplateのDI
	private final RestTemplate restTemplate;
	
	public ArrayList<SearchResult> searchMenu(SearchRequirement searchReq) {
		
//		=== ユーザーが入力した駅名から緯度経度への変換 ===
		
//		urlのテンプレート
		String geocodeUrl = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyBvngfDlCJ3HuSMFjB0jylBTpowN9pb-RQ&language=ja&components=country:JP&address={address}";
		
		Map<String, String> geocodeParams = new HashMap<>(); //テンプレートに代入する検索条件を作成
		geocodeParams.put("address", searchReq.getCenter());
		String geocodeBody = restTemplate.getForObject(geocodeUrl, String.class, geocodeParams); //APIを利用して結果をJSONで格納
		String location = null; //緯度経度を入れる変数 
		
		ObjectMapper mapper = new ObjectMapper(); //オブジェクトとjson変換を行うクラスのインスタンス化
		try {
			JsonNode rootNode = mapper.readTree(geocodeBody); //レスポンスボディからjsonノードに変換
			String status = rootNode.path("status").asText(); //ステータスを取得
			
			if (status.equals("OK")) {
                JsonNode locationNode = rootNode.path("results").get(0).path("geometry").path("location"); //緯度経度が格納されているlocationオブジェクトを取得
                double lat = locationNode.path("lat").asDouble();
                double lng = locationNode.path("lng").asDouble();
                location = lat + ", " + lng;
            } else {
//            	TODO 取得できなかったらどうする
                System.out.println("Error: " + status);
            }

		} catch (JsonProcessingException e) {
//			TODO 取得できなかったらどうする
			e.printStackTrace();
		}
		
//		=== 変換終わり ===
		
		String nearbyUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyBvngfDlCJ3HuSMFjB0jylBTpowN9pb-RQ&language=ja&keyword={keyword}&location={location}&radius={radius}";

		Map<String, String> nearbyParams = new HashMap<>();
		nearbyParams.put("keyword", searchReq.getKeyword());
		nearbyParams.put("location", location);
		nearbyParams.put("radius", String.valueOf(searchReq.getRadius()));
		
		String nearbyBody = restTemplate.getForObject(nearbyUrl, String.class, nearbyParams);

		ArrayList<SearchResult> searchResult = new ArrayList<>(); //returnするリストを用意
		
//		JSONからエンティティへの変換
		try {
			PlacesAPIResponse response = mapper.readValue(nearbyBody, PlacesAPIResponse.class); //エンティティにマッピング
			List<Result> results = response.getResults(); //検索結果リストの取り出し
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
