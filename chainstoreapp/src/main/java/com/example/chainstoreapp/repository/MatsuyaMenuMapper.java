package com.example.chainstoreapp.repository;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.chainstoreapp.entity.MatsuyaMenu;

@Mapper
public interface MatsuyaMenuMapper {

	void dropTempMainTable();
	void dropTempSideSetTable();
	void createTempMain(@Param("priceLimit") int priceLimit);
	int selectMainPrice();
	void createTempSideSet();
	ArrayList<MatsuyaMenu> selectWithinPriceLimit(@Param("priceLimit") int priceLimit, @Param("mainPrice") int mainPrice);
	
}
