package com.example.chainstoreapp.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.chainstoreapp.entity.SearchRequirement;
import com.example.chainstoreapp.entity.SearchResult;
import com.example.chainstoreapp.form.ChainStoreForm;
import com.example.chainstoreapp.helper.ChainStoreHelper;
import com.example.chainstoreapp.service.ChainStoreService;
import com.example.chainstoreapp.service.StationService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/chainstoremenus")
@RequiredArgsConstructor
public class ChainStoreController {
	
//	サービスのDI
	private final StationService stationService;
	private final ChainStoreService chainStoreService;

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
	@GetMapping("/search")
	@ResponseBody
	public String search(ChainStoreForm form, Model model/*, RedirectAttributes attributes*/){
		System.out.println("受信");
		
//		検索条件をフォームからエンティティへ変換
		SearchRequirement searchReq = ChainStoreHelper.convertSearchReq(form);
		
//		サービスを用いてメニュー群を取得
		List<SearchResult> searchResults = chainStoreService.searchMenu(searchReq);
		
		ObjectMapper objectMapper = new ObjectMapper();
	    try {
	        String jsonString = objectMapper.writeValueAsString(searchResults);
	        return jsonString;
	    } catch (JsonProcessingException e) {
	        e.printStackTrace();
	        return null;
	    }

//		if(searchResults != null) {
////			取得できればモデルに格納
//			model.addAttribute("searchresults", searchResults);
//		}else {
////			できなければフラッシュメッセージを設定
//			attributes.addFlashAttribute("errorMessage", "対象データがありません");
//		}
////		検索結果一覧画面を表示
//		return "chainstoremenu/result";
	}
}
