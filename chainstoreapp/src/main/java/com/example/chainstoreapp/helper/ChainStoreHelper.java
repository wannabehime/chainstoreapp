package com.example.chainstoreapp.helper;

import com.example.chainstoreapp.entity.SearchRequirement;
import com.example.chainstoreapp.form.ChainStoreForm;

public class ChainStoreHelper {

//	SearchRequirementへの変換
	public static SearchRequirement convertSearchReq(ChainStoreForm form){
		SearchRequirement searchReq = new SearchRequirement();
		searchReq.setKeyword(form.getKeyword());
		searchReq.setCenter(form.getCenter());
		searchReq.setNowLatLng(form.getNowLatLng());
		searchReq.setRadius(form.getRadius());
		return searchReq;
	}
	
//	ChainStoreFormへの変換
	public static ChainStoreForm convertChainStoreForm(SearchRequirement searchReq) {
		ChainStoreForm form = new ChainStoreForm();
		form.setKeyword(searchReq.getKeyword());
		form.setCenter(searchReq.getCenter());
		form.setNowLatLng(searchReq.getNowLatLng());
		form.setRadius(searchReq.getRadius());
		return form;
	}
}
