package com.example.chainstoreapp.service.impl;

import java.util.ArrayList;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.chainstoreapp.entity.MatsuyaMenu;
import com.example.chainstoreapp.repository.MatsuyaMenuMapper;
import com.example.chainstoreapp.service.MatsuyaMenuService;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class MatsuyaMenuServiceImpl implements MatsuyaMenuService {
	
	private final MatsuyaMenuMapper menuMapper;

	@Override
	public ArrayList<MatsuyaMenu> shuffleMatsuyaMenus(Integer priceLimit) {
		menuMapper.dropTempMainTable();
		menuMapper.dropTempSideSetTable();
		menuMapper.createTempMain(priceLimit);
		int mainPrice = menuMapper.selectMainPrice();
		menuMapper.createTempSideSet();
		return menuMapper.selectWithinPriceLimit(priceLimit, mainPrice);
	}

}
