package com.example.chainstoreapp.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlacesAPIResponse {
	
//	下3つ必須
	private String[] html_attributions;
//	検索結果が格納される
	private Object[] results;
	private String status;
	
//	必須ではない
	private String error_message;
	private String[] info_messages;
	private String next_page_token;
}
