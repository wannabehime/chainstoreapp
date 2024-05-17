package com.example.chainstoreapp.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.example.chainstoreapp.entity.SearchResult;
import com.example.chainstoreapp.service.ChainStoreService;

import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/chainstoremenus")
@RequiredArgsConstructor
public class ChainStoreController {
	
//	サービスのDI
	private final ChainStoreService chainStoreService;

//	トップ検索画面の表示
	@GetMapping
	public String top() {
		return "chainstoremenu/top";
	}
	
//	検索結果一覧画面の表示
	@GetMapping("/search")
	public String search(Model model, RedirectAttributes attributes){
//		サービスを用いてメニュー群を取得
		List<SearchResult> searchResults = chainStoreService.searchMenu();

		if(searchResults != null) {
//			取得できればモデルに格納
			model.addAttribute("searchresults", chainStoreService.searchMenu());
		}else {
//			できなければフラッシュメッセージを設定
			attributes.addFlashAttribute("errorMessage", "対象データがありません");
		}
//		検索結果一覧画面を表示
		return "chainstoremenu/result";
	}
}
