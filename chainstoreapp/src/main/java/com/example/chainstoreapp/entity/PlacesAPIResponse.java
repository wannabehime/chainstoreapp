//package com.example.chainstoreapp.entity;
//
//import java.util.List;
//
//import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
//
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
////JSONにあってこのクラスにないプロパティを無視
//@JsonIgnoreProperties(ignoreUnknown = true)
////GoogleMap PlacesAPIのレスポンスの変換先エンティティ
//public class PlacesAPIResponse {
//	
////	=== 以下必須 ===
////	private String[] html_attributions;
////	検索結果
//	private List<Result> results;
////	ステータスコード
////	private String status;
////	=== 以上必須 ===
////	検索結果JSONの構造クラス
//	@Data
//	@JsonIgnoreProperties(ignoreUnknown = true)
//	public static class Result {
//		private Geometry geometry;
//		private String name;
//		private Opening_hours opening_hours;
//		
//		@Data
//		@JsonIgnoreProperties(ignoreUnknown = true)
//		public static class Geometry {
//			private Location location;
//			
//			@Data
//			@JsonIgnoreProperties(ignoreUnknown = true)
//			public static class Location {
//				private double lat;
//				private double lng;
//			}
//			
//		}
//		
//		@Data
//		@JsonIgnoreProperties(ignoreUnknown = true)
//		public static class Opening_hours {
//			private boolean open_now;
//			private String[] weekday_text;
//		}
//		
//	}
//	
////	ステータスコードが"OK"ではなかった場合のエラーメッセージ
////	private String error_message;
////	private String[] info_messages;
////	#TODO: 件数が多ければこれを使う？
////	private String next_page_token;
//}
