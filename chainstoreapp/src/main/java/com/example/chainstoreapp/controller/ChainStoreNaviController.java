package com.example.chainstoreapp.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.client.RestClientException;

import com.example.chainstoreapp.entity.Menu;
import com.example.chainstoreapp.entity.Station;
import com.example.chainstoreapp.entity.Store;
import com.example.chainstoreapp.form.SearchStoresForm;
import com.example.chainstoreapp.service.MenuService;
import com.example.chainstoreapp.service.StationService;
import com.example.chainstoreapp.service.StoreService;

import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("chainstorenavi") // URLとクラスをマッピング
@RequiredArgsConstructor // finalが付けられたフィールドを引数とするコンストラクタを自動生成。かつ、コンストラクタが1つのみのとき、DIでインスタンスを受け取るコンストラクタを示す@Autowiredを省略可

public class ChainStoreNaviController {

//	サービスのDI
	private final StationService stationService;
	private final StoreService storeService;
	private final MenuService menuService;

//	------ ホーム画面の表示 ------
	@GetMapping
	public String displayIndexPage() {
		return "chainstorenavi/index";
	}
	
//	------ 入力値から、候補となる駅リストを取得 ------
	@GetMapping("get-stations")
	@ResponseBody // 戻り値がそのままレスポンスのコンテンツになる。jsonを返すために付ける
	public List<Station> getStations(@RequestParam String input){ // @RequestParam:引数名と一致するnameを持つ、フォームの値を受け取る
		return stationService.getStations(input);
	}
	
//	------ ブランド名と中心地から、該当するチェーン店を検索 ------
	@GetMapping("search-stores")
	@ResponseBody
	public List<Store> searchStores(SearchStoresForm searchStoresForm){
		return storeService.searchStores(searchStoresForm);
	}

//	------ ブランド名と予算から、メニューを取得 ------
	@GetMapping("get-menus")
	@ResponseBody
	public List<Menu> getMenus(@RequestParam String brandName, @RequestParam Integer priceLimit){
		return menuService.getMenus(brandName, priceLimit);
	}

	
//	------ searchStoresのstoreService.searchStoresで発生するRestClientExceptionを処理する ------
	@ExceptionHandler(RestClientException.class) // 指定した例外の発生時に処理を行うメソッドに付ける
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR) // メソッドでは通常ResponseEntityを返すが、今回ステータスコードを返せればよくボディは不要。戻り値なしにし、代わりに、ステータスコードを指定できるアノテーションを付与
	public void handleRestClientException(RestClientException e){
		; // 空文
    }

}
