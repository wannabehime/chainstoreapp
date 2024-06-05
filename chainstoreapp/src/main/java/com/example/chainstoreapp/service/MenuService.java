package com.example.chainstoreapp.service;

import java.util.ArrayList;

import com.example.chainstoreapp.entity.Menu;

public interface MenuService {
	
	ArrayList<Menu> shuffleMenus(String brandName, Integer priceLimit);

}
