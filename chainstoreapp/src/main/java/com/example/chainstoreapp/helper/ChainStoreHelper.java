package com.example.chainstoreapp.helper;

import com.example.chainstoreapp.entity.SearchRequirement;
import com.example.chainstoreapp.form.SearchStoresForm;

public class ChainStoreHelper {

//	SearchRequirementへの変換
	public static SearchRequirement convertSearchReq(SearchStoresForm form){
		SearchRequirement searchReq = new SearchRequirement();
		searchReq.setBrandName(form.getBrandName());
		searchReq.setCenter(form.getCenter());
		searchReq.setCurrentLatLng(form.getCurrentLatLng());
		return searchReq;
	}
	
//	ChainStoreFormへの変換
	public static SearchStoresForm convertChainStoreForm(SearchRequirement searchReq) {
		SearchStoresForm form = new SearchStoresForm();
		form.setBrandName(searchReq.getBrandName());
		form.setCenter(searchReq.getCenter());
		form.setCurrentLatLng(searchReq.getCurrentLatLng());
		return form;
	}
}
