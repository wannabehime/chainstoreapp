package com.example.chainstoreapp.repository;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.chainstoreapp.entity.MatsuyaMenu;

@Mapper
public interface MenuMapper {

	ArrayList<MatsuyaMenu> selectWithinPriceLimit(@Param("priceLimit") int priceLimit);
	
}
