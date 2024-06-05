package com.example.chainstoreapp.repository;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.chainstoreapp.entity.Menu;

@Mapper
public interface MenuMapper {

	void dropTempMainTable();
	void dropTempSideSetTable();
	void createTempMain(@Param("tableName") String tableName, @Param("priceLimit") int priceLimit);
	int selectMainPrice();
	void createTempSideSet(@Param("tableName") String tableName);
	ArrayList<Menu> selectWithinPriceLimit(@Param("priceLimit") int priceLimit, @Param("mainPrice") int mainPrice);
	
}
