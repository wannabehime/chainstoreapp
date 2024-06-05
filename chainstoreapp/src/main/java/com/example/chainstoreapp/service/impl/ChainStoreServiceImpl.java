package com.example.chainstoreapp.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

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
	
//	ユーザーの入力からメニュー一覧を取得
	public String searchMenu(SearchRequirement searchReq) {
		
//		=== 初めに店舗検索の中心地を確定させる ===
		String location = null; //店舗検索の中心の緯度経度を入れる変数
		ObjectMapper mapper = new ObjectMapper(); //オブジェクトとjson変換を行うクラスのインスタンス化
		
		if(searchReq.getCenter().equals("現在地")) { //場所に現在地が指定されていれば、検索の中心に現在地の経緯度を代入
//			TODO latlngが取得できていない場合も考える
			location = searchReq.getNowLatLng().replaceAll("[()]", ""); //()を除いている
		}else {										//指定されていなければ、ユーザーが入力した駅名から経緯度へ変換
//			urlのテンプレート
			String geocodeUrl = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyBvngfDlCJ3HuSMFjB0jylBTpowN9pb-RQ&language=ja&components=country:JP&address={address}";
			
			Map<String, String> geocodeParams = new HashMap<>(); //テンプレートに代入する検索条件を作成
			geocodeParams.put("address", searchReq.getCenter());
			String geocodeBody = restTemplate.getForObject(geocodeUrl, String.class, geocodeParams); //APIを利用して結果をJSONで格納
			 
			try {
				JsonNode rootNode = mapper.readTree(geocodeBody); //レスポンスボディからjsonノードに変換
				String status = rootNode.path("status").asText(); //ステータスを取得
				
				if (status.equals("OK")) {
	                JsonNode locationNode = rootNode.path("results").get(0).path("geometry").path("location"); //緯度経度が格納されているlocationオブジェクトを取得
	                double lat = locationNode.path("lat").asDouble();
	                double lng = locationNode.path("lng").asDouble();
	                location = lat + ", " + lng;
	            } else {
//	            	TODO 取得できなかったらどうする
	                System.out.println("Error: " + status);
	            }

			} catch (JsonProcessingException e) {
//				TODO 取得できなかったらどうする
				e.printStackTrace();
			}
		}
		
//		=== ここから店舗検索 ===
//		指定した起点から、同心円状の範囲にある店舗を検索するためのAPIのURL
		String nearbyUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyBvngfDlCJ3HuSMFjB0jylBTpowN9pb-RQ&language=ja&keyword={keyword}&location={location}&radius={radius}";

//		店舗名・起点・範囲をパラメータにセット
		Map<String, String> nearbyParams = new HashMap<>();
		String brandName = searchReq.getKeyword();
		nearbyParams.put("keyword", brandName);
		nearbyParams.put("location", location);
		nearbyParams.put("radius", String.valueOf(searchReq.getRadius()));
		
		String nearbyBody = restTemplate.getForObject(nearbyUrl, String.class, nearbyParams); //APIから結果をJSON文字列で取得

		ArrayList<SearchResult> searchResults = new ArrayList<>(); //returnするリストを用意
		
		String matchedName = switch (brandName) {
			case "松屋", "すき家", "吉野家", "はなまるうどん" -> brandName + ".*店";
			case "丸亀製麺" -> brandName + ".*";
			default -> throw new IllegalArgumentException("Unexpected value: " + searchReq.getKeyword());
		};
		
//		JSONからエンティティへの変換
		try {
//			現在地から各店舗までの距離・時間を取得するAPIのURL
//			TODO: 現在地取得できなかったらどうする
			String directionUrl = "https://maps.googleapis.com/maps/api/directions/json?key=AIzaSyBvngfDlCJ3HuSMFjB0jylBTpowN9pb-RQ&language=ja&mode=walking&destination={destination}&origin={origin}";
			String origin = searchReq.getNowLatLng().replaceAll("[()]", ""); //起点となる現在地の経緯度を取得
			
			JsonNode neabyNode = mapper.readTree(nearbyBody).path("results");
			for(int i = 0; i < neabyNode.size(); i++) {
				JsonNode nearbyResultNode = neabyNode.get(i);
				String name = nearbyResultNode.path("name").asText();
				boolean open_now = nearbyResultNode.path("opening_hours").path("open_now").asBoolean();
				
				if(name.matches(matchedName) && open_now == true) {
					double lat = nearbyResultNode.path("geometry").path("location").path("lat").asDouble();
					double lng = nearbyResultNode.path("geometry").path("location").path("lng").asDouble();
					
					String destination = lat + ", " + lng; //目的地の経緯度
					Map<String, String> directionParams = new HashMap<>(); //テンプレートに代入する検索条件を作成
					directionParams.put("origin", origin);
					directionParams.put("destination", destination);
					String directionBody = restTemplate.getForObject(directionUrl, String.class, directionParams);
					
					JsonNode directionNode = mapper.readTree(directionBody).path("routes").get(0).path("legs").get(0);
					String distance = directionNode.path("distance").path("text").asText();
					String duration = directionNode.path("duration").path("text").asText();
					
					SearchResult searchRes = new SearchResult();
					searchRes.setStoreName(name);
					searchRes.setLat(lat);
					searchRes.setLng(lng);
					searchRes.setDistance(distance);
					searchRes.setDuration(duration);
					searchRes.setOpen_now(open_now);
					searchResults.add(i, searchRes);
				}
			}
			return mapper.writeValueAsString(searchResults);
			
		}catch (JsonProcessingException e) {
			e.printStackTrace();
			return null;
		}
	}

}
