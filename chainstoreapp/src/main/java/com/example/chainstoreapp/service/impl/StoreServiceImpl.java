package com.example.chainstoreapp.service.impl;

import java.util.ArrayList;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.example.chainstoreapp.entity.Store;
import com.example.chainstoreapp.form.SearchStoresForm;
import com.example.chainstoreapp.service.StoreService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service // ビジネスロジックに付与する、インスタンス生成アノテーション
@RequiredArgsConstructor // finalが付けられたフィールドを引数とするコンストラクタを自動生成。かつ、コンストラクタが1つのみのとき、DIでインスタンスを受け取るコンストラクタを示す@Autowiredを省略可

//====== コントローラーのsearchStoresで使うサービス ======
public class StoreServiceImpl implements StoreService {

//	RestTemplateのDI
	private final RestTemplate restTemplate;
	
	@Override
//	ブランド名と中心地から、該当するチェーン店を検索
	public ArrayList<Store> searchStores(SearchStoresForm searchStoresForm) {
		
//		引数に用いる値を取得
		ObjectMapper mapper = new ObjectMapper(); // オブジェクトとjson変換を行うクラスのインスタンス化
		String brandName = searchStoresForm.getBrandName();
		String center = searchStoresForm.getCenter();
		String currentLatLng = searchStoresForm.getCurrentLatLng().replaceAll("[()]", ""); // 起点となる現在地の経緯度を取得
		String stationLatLng = searchStoresForm.getStationLatLng().replaceAll("[()]", "");

		ArrayList<Store> stores = new ArrayList<>(); // returnするリストを用意
		JsonNode nearbySearchResultsNode = nearbySearchAPIExecute(mapper, brandName, center, currentLatLng, stationLatLng); // 店舗検索の結果を格納
		
		for(JsonNode placeNode : nearbySearchResultsNode) { // 検索結果一つ一つをreturnするリストに格納
			Store store = createStore(mapper, placeNode, brandName, currentLatLng);
			if(store != null) { // 適切な検索結果でなければnullが返ってくるので排除
				stores.add(store);
			}
		}
		return stores;
	}
	
//	nearbySearchAPIの検索結果の場所一つ一つについて、店名等をチェックして適切であれば店舗インスタンスを生成
	public Store createStore(ObjectMapper mapper, JsonNode placeNode, String brandName, String currentLatLng) {
		
//		引数に用いる値を取得
		String placeName = placeNode.path("name").asText(); // 場所の名前
		String brandNamePattern = switch (brandName) { // 場所の名前が、検索しているブランド名に適合するかを判定する正規表現
			case "松屋", "すき家", "吉野家", "はなまるうどん" -> brandName + ".*店";
			default -> brandName + ".*";
		};
		double latitude = placeNode.path("geometry").path("location").path("lat").asDouble();
		double longitude = placeNode.path("geometry").path("location").path("lng").asDouble();
		
		if(placeName.matches(brandNamePattern) && latitude > 0 && longitude > 0) { // 場所の名前がブランド名に適合し、経緯度が取得出来た場合に店舗インスタンスを生成
			String duration = StringUtils.hasText(currentLatLng) // 現在地、かつdirectionsAPIによって所要時間も取得できていれば、所要時間を格納。そうでなければ「-分」を格納
					&& StringUtils.hasText(directionsAPIExecute(mapper, latitude, longitude, currentLatLng))
						? directionsAPIExecute(mapper, latitude, longitude, currentLatLng)
						: "-分";
			return new Store(latitude, longitude, duration);
		}else {
			return null;
		}
	}

//	nearbySearchAPIを実行
	public JsonNode nearbySearchAPIExecute(ObjectMapper mapper, String brandName, String center, String currentLatLng, String stationLatLng) {
		try {
//			指定した起点から、同心円状の範囲にある店舗を検索するためのAPIのURL
			String nearbySearchUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
					+ "?key=AIzaSyCV8QwXKedqprb4umRvDzUS8qXuRN9eCU8&language=ja&keyword={brandName}&location={centerLatLng}&radius={radius}";
			String centerLatLng = center.equals("現在地") ? currentLatLng : stationLatLng; //店舗検索の中心の緯度経度を入れる変数
			String nearbySearchResponse = restTemplate.getForObject(nearbySearchUrl, String.class, brandName, centerLatLng, "500"); //APIからレスポンスボディをJSON文字列で取得
			return mapper.readTree(nearbySearchResponse).path("results");
		} catch (Exception e) { // getForObjectやreadTreeで発生する例外をキャッチ
			// コントローラーのExceptionHandlerにキャッチさせるために例外を発生させる。RestClientExceptionはRestTemplateの基本クラス。errorMsgは使わないがコンストラクタに引数が必要なので仮に設定
			throw new RestClientException("errorMsg");
		}
	}
	
//	directionsAPIを実行
	public String directionsAPIExecute(ObjectMapper mapper, double latitude, double longitude, String currentLatLng){
		try {
//			現在地から各店舗までの距離・時間を取得するAPIのURL
			String directionsUrl = "https://maps.googleapis.com/maps/api/directions/json"
					+ "?key=AIzaSyCV8QwXKedqprb4umRvDzUS8qXuRN9eCU8&language=ja&mode=walking&origin={currentLatLng}&destination={storeLatLng}";
			String storeLatLng = latitude + ", " + longitude; //目的地の経緯度
			String directionsResponse = restTemplate.getForObject(directionsUrl, String.class, currentLatLng, storeLatLng);
//			routes:複数のルートを含むので、get(0)で一番目を取り出す / legs:経由地を指定した場合に区間毎の情報を持つが、今回指定していないので情報は1つ。get(0)で取り出す / duration:所要時間 / text:テキストで取り出す
			return mapper.readTree(directionsResponse).path("routes").path(0).path("legs").path(0).path("duration").path("text").asText();
		} catch (Exception e) { // getForObjectやreadTreeで発生する例外をキャッチ
			return "-分";
		}
	}
}
