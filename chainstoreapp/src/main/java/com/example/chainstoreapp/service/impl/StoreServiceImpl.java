package com.example.chainstoreapp.service.impl;

import java.util.ArrayList;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.chainstoreapp.entity.SearchResult;
import com.example.chainstoreapp.form.SearchStoresForm;
import com.example.chainstoreapp.service.StoreService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StoreServiceImpl implements StoreService {

//	RestTemplateのDI
	private final RestTemplate restTemplate;
	
//	ユーザーの入力からメニュー一覧を取得
	public String searchStores(SearchStoresForm searchStoresForm) {
		
//		JSONからエンティティへの変換
		try {
			ObjectMapper mapper = new ObjectMapper(); //オブジェクトとjson変換を行うクラスのインスタンス化
			
//			指定した起点から、同心円状の範囲にある店舗を検索するためのAPIのURL
			String nearbySearchUrl = "https://maps.googleapis.com/maps/api/placeNode/nearbysearch/json"
					+ "?key=AIzaSyCV8QwXKedqprb4umRvDzUS8qXuRN9eCU8&language=ja&keyword={brandName}&location={centerLatLng}&radius={radius}";
			String brandName = searchStoresForm.getBrandName();
			String centerLatLng = searchStoresForm.getCenter().equals("現在地") 
					? searchStoresForm.getCurrentLatLng().replaceAll("[()]", "") 
					: searchStoresForm.getStationLatLng().replaceAll("[()]", ""); //店舗検索の中心の緯度経度を入れる変数

			String nearbySearchResponse = restTemplate.getForObject(nearbySearchUrl, String.class, brandName, centerLatLng, "500"); //APIからレスポンスボディをJSON文字列で取得
			JsonNode nearbySearchResultsNode = mapper.readTree(nearbySearchResponse).path("results");
			String brandNamePattern = switch (brandName) {
				case "松屋", "すき家", "吉野家", "はなまるうどん" -> brandName + ".*店";
				default -> brandName + ".*";
			};

//			現在地から各店舗までの距離・時間を取得するAPIのURL
//			TODO: 現在地取得できなかったらどうする
			String directionsUrl = "https://maps.googleapis.com/maps/api/directions/json"
					+ "?key=AIzaSyCV8QwXKedqprb4umRvDzUS8qXuRN9eCU8&language=ja&mode=walking&origin={currentLatLng}&destination={storeLatLng}";
			String currentLatLng = searchStoresForm.getCurrentLatLng().replaceAll("[()]", ""); //起点となる現在地の経緯度を取得
			
			ArrayList<SearchResult> searchResults = new ArrayList<>(); //returnするリストを用意

			for(JsonNode placeNode : nearbySearchResultsNode) {
				String placeName = placeNode.path("name").asText();
				
				if(placeName.matches(brandNamePattern) /*&& open_now == true*/) {
					double storelat = placeNode.path("geometry").path("location").path("lat").asDouble();
					double storelng = placeNode.path("geometry").path("location").path("lng").asDouble();
					
					String storeLatLng = storelat + ", " + storelng; //目的地の経緯度
					String directionsResponse = restTemplate.getForObject(directionsUrl, String.class, currentLatLng, storeLatLng);
//					routes:複数のルートを含むので、get(0)で一番目を取り出す / legs:経由地を指定した場合に区間毎の情報を持つが、今回指定していないので情報は1つ。get(0)で取り出す / duration:所要時間 / text:テキストで取り出す
					String duration = mapper.readTree(directionsResponse).path("routes").get(0).path("legs").get(0).path("duration").path("text").asText();
					
					SearchResult searchRes = new SearchResult();
					searchRes.setLat(storelat);
					searchRes.setLng(storelng);
					searchRes.setDuration(duration);
					searchResults.add(searchRes);
				}
			}
			return mapper.writeValueAsString(searchResults);
			
		}catch (JsonProcessingException e) {
			e.printStackTrace();
			return null;
		}
	}

//	店舗名・起点・範囲をパラメータにセット
//	Map<String, String> searchParams = new HashMap<>();
//	searchParams.put("brandName", brandName);
//	searchParams.put("location", location);
//	searchParams.put("radius", "500");
//	=== 初めに店舗検索の中心地を確定させる ===
//	boolean open_now = placeNode.path("opening_hours").path("open_now").asBoolean();
//	Map<String, String> directionParams = new HashMap<>(); //テンプレートに代入する検索条件を作成
//	directionParams.put("origin", origin);
//	directionParams.put("destination", destination);
//	String distance = directionNode.path("distance").path("text").asText();
//	String duration = directionNode.path("duration").path("text").asText();
	
//	if(searchStoresForm.getCenter().equals("現在地")) { //場所に現在地が指定されていれば、検索の中心に現在地の経緯度を代入
//	TODO latlngが取得できていない場合も考える
//	location = searchStoresForm.getCurrentLatLng().replaceAll("[()]", ""); //()を除いている
//}else {										//指定されていなければ、ユーザーが入力した駅名から経緯度へ変換
//	urlのテンプレート
//	String geocodeUrl = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCV8QwXKedqprb4umRvDzUS8qXuRN9eCU8&language=ja&components=country:JP&address={address}";
//	
//	Map<String, String> geocodeParams = new HashMap<>(); //テンプレートに代入する検索条件を作成
//	geocodeParams.put("address", searchReq.getCenter());
//	String geocodeBody = restTemplate.getForObject(geocodeUrl, String.class, geocodeParams); //APIを利用して結果をJSONで格納
//	 
//	try {
//		JsonNode rootNode = mapper.readTree(geocodeBody); //レスポンスボディからjsonノードに変換
//		String status = rootNode.path("status").asText(); //ステータスを取得
//		
//		if (status.equals("OK")) {
//            JsonNode locationNode = rootNode.path("results").get(0).path("geometry").path("location"); //緯度経度が格納されているlocationオブジェクトを取得
//            double lat = locationNode.path("lat").asDouble();
//            double lng = locationNode.path("lng").asDouble();
//            location = lat + ", " + lng;
//        } else {
////        	TODO 取得できなかったらどうする
//            System.out.println("Error: " + status);
//        }
//
//	} catch (JsonProcessingException e) {
////		TODO 取得できなかったらどうする
//		e.printStackTrace();
//	}
//}

}
