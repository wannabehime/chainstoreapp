package com.example.chainstoreapp.repository;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.chainstoreapp.entity.Station;

@Mapper // MyBatisによる自動実装・コンポーネントとして登録され@Autowiredでインジェクションされる・マッパーファイルのSQLにマッピングされる
public interface StationMapper { // TODO: マッパーファイルと合わせて修正
	ArrayList<Station> selectByStation_Name(@Param("searchTerm") String searchTerm, @Param("name") String name, @Param("prefix") String prefix);
}
