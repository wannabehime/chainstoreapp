package com.example.chainstoreapp.service;

import java.util.ArrayList;

import com.example.chainstoreapp.entity.MatsuyaMenu;

public interface MatsuyaMenuService {
	
	ArrayList<MatsuyaMenu> shuffleMatsuyaMenus(Integer priceLimit);

}
