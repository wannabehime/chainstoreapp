package com.example.chainstoreapp.service.impl;

import java.util.ArrayList;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.chainstoreapp.entity.Menu;
import com.example.chainstoreapp.repository.MenuMapper;
import com.example.chainstoreapp.service.MenuService;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class MenuServiceImpl implements MenuService {
	
	private final MenuMapper menuMapper;
	@Override
	public ArrayList<Menu> shuffleMenus(String brandName, Integer priceLimit) {
		
		String tableName = switch (brandName){
			case "松屋" -> "matsuya_menus";
			case "はなまるうどん" -> "hanamaru_menus";
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
