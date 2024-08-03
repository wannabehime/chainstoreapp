package com.example.chainstoreapp.service.impl;

import java.util.ArrayList;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.chainstoreapp.entity.Menu;
import com.example.chainstoreapp.repository.MenuMapper;
import com.example.chainstoreapp.service.MenuService;

import lombok.RequiredArgsConstructor;

@Service
@Transactional // トランザクション管理。更新処理を含むサービスに付与
@RequiredArgsConstructor
public class MenuServiceImpl implements MenuService {
	
	private final MenuMapper menuMapper;
	@Override
	public ArrayList<Menu> shuffleMenus(String brandName, Integer priceLimit) {
		
		String tableName = switch (brandName){
			case "松屋" -> "matsuya_menus";
			case "すき家" -> "sukiya_menus";
			case "吉野家" -> "yoshinoya_menus";
			case "はなまるうどん" -> "hanamaru_menus";
			case "丸亀製麺" -> "marugame_menus";
			default -> throw new IllegalArgumentException("Unexpected value: " + brandName);
		};
		
		menuMapper.dropTempMainTable();
		menuMapper.dropTempSideSetTable();
		menuMapper.createTempMain(tableName, priceLimit);
		int mainPrice = menuMapper.selectMainPrice();
		menuMapper.createTempSideSet(tableName);
		return menuMapper.selectWithinPriceLimit(priceLimit, mainPrice);
	}

}
