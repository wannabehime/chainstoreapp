package com.example.chainstoreapp.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.chainstoreapp.entity.Menu;
import com.example.chainstoreapp.entity.SearchRequirement;
import com.example.chainstoreapp.entity.Station;
import com.example.chainstoreapp.form.SearchStoresForm;
import com.example.chainstoreapp.helper.ChainStoreHelper;
import com.example.chainstoreapp.service.ChainStoreService;
import com.example.chainstoreapp.service.MenuService;
import com.example.chainstoreapp.service.StationService;

import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("chainstoresearch") // URLとクラスをマッピング TODO:URL名
@RequiredArgsConstructor // finalが付けられたフィールドを引数とするコンストラクタを自動生成。かつ、コンストラクタが1つのみのとき、DIでインスタンスを受け取るコンストラクタを示す@Autowiredを省略可

public class ChainStoreController { // TODO: クラス名

//	サービスのDI TODO:変数名
	private final StationService stationService;
	private final ChainStoreService chainStoreService;
	private final MenuService menuService;

//	------ ホーム画面の表示 ------
	@GetMapping
	public String displayIndexPage() {
		return "chainstoresearch/index"; // TODO:URL名
	}
	
//	------ 入力値から、候補となる駅リストを取得 ------
	@GetMapping("get-stations")
	@ResponseBody // 戻り値がそのままレスポンスのコンテンツになる。jsonを返すために付ける
	public List<Station> getStations(@RequestParam String input){ // @RequestParam:引数名と一致するnameを持つ、フォームの値を受け取る
		List<Station> stations = stationService.getStations(input);
		return stations;
	}
	
//	------ ブランド名と中心地から、該当するチェーン店を検索 ------
	@GetMapping("search-stores")
	@ResponseBody
	public String searchStores(SearchStoresForm form){
		SearchRequirement searchReq = ChainStoreHelper.convertSearchReq(form); // 検索条件をフォームからエンティティへ変換
		return chainStoreService.searchMenu(searchReq); // サービスを用いてメニュー群を取得
	}

//	------ ブランド名と予算から、メニューを取得 ------
	@GetMapping("get-menus")
	@ResponseBody
	public List<Menu> getMenus(@RequestParam String brandName, @RequestParam Integer priceLimit){
		return menuService.shuffleMenus(brandName, priceLimit); // サービスを用いてメニュー群を取得
	}
}
