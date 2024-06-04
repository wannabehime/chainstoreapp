package com.example.chainstoreapp.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.chainstoreapp.entity.MatsuyaMenu;
import com.example.chainstoreapp.entity.SearchRequirement;
import com.example.chainstoreapp.form.ChainStoreForm;
import com.example.chainstoreapp.helper.ChainStoreHelper;
import com.example.chainstoreapp.service.ChainStoreService;
import com.example.chainstoreapp.service.MatsuyaMenuService;
import com.example.chainstoreapp.service.StationService;

import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/chainstoremenus")
@RequiredArgsConstructor
public class ChainStoreController {
	
//	サービスのDI
	private final StationService stationService;
	private final ChainStoreService chainStoreService;
	private final MatsuyaMenuService matsuyaMenuService;

//	トップ検索画面の表示
	@GetMapping
	public String top() {
		return "chainstoremenu/top";
	}
	
//	駅名の一部から、候補となる駅名リストを返す
	@GetMapping("/getstationnames")
	@ResponseBody
	public List<String> getStationNames(@RequestParam String term){
		List<String> stationNames = stationService.getStationNames(term);
		return stationNames;
	}

//	検索結果一覧画面の表示
	@GetMapping("/menusearch")
	@ResponseBody
	public List<MatsuyaMenu> searchMenus(@RequestParam Integer priceLimit){
		return matsuyaMenuService.shuffleMatsuyaMenus(priceLimit); // サービスを用いてメニュー群を取得
	}

//	検索結果一覧画面の表示
	@GetMapping("/storesearch")
	@ResponseBody
	public String searchStores(ChainStoreForm form){
		SearchRequirement searchReq = ChainStoreHelper.convertSearchReq(form); // 検索条件をフォームからエンティティへ変換
		return chainStoreService.searchMenu(searchReq); // サービスを用いてメニュー群を取得
	}
}
