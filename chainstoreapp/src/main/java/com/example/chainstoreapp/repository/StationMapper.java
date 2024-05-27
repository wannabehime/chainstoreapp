package com.example.chainstoreapp.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.chainstoreapp.entity.Station;

@Mapper
public interface StationMapper {
	
	List<Station> selectByStation_Name(@Param("station_name") String station_name);

}
