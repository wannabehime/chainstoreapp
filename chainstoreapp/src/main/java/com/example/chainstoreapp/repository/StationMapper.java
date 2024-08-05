package com.example.chainstoreapp.repository;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.chainstoreapp.entity.Station;

@Mapper // MyBatisによる自動実装・コンポーネントとして登録され@Autowiredでインジェクションされる・マッパーファイルのSQLにマッピングされる
public interface StationMapper {
	ArrayList<Station> selectStationsIncludingInput(
			@Param("patternIncludingInput") String patternIncludingInput,
			@Param("inputPlusStation") String inputPlusStation,
			@Param("patternBeginningWithInput") String patternBeginningWithInput
	);
}
