package com.example.chainstoreapp.repository;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.chainstoreapp.entity.Station;

@Mapper
public interface StationMapper {
	
	ArrayList<Station> selectByStation_Name(@Param("searchTerm") String searchTerm, @Param("name") String name, @Param("prefix") String prefix);

}
