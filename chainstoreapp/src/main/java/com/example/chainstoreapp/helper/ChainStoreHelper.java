package com.example.chainstoreapp.helper;

import com.example.chainstoreapp.entity.SearchRequirement;
import com.example.chainstoreapp.form.ChainStoreForm;

public class ChainStoreHelper {

//	SearchRequirementへの変換
	public static SearchRequirement convertSearchReq(ChainStoreForm form){
		SearchRequirement searchReq = new SearchRequirement();
		searchReq.setKeywords(form.getKeywords());
		searchReq.setCenter(form.getCenter());
		searchReq.setRange(form.getRange());
		return searchReq;
	}
	
//	ChainStoreFormへの変換
	public static ChainStoreForm convertChainStoreForm(SearchRequirement searchReq) {
		ChainStoreForm form = new ChainStoreForm();
		form.setKeywords(searchReq.getKeywords());
		form.setCenter(searchReq.getCenter());
		form.setRange(searchReq.getRange());
		return form;
	}
}
