package com.example.chainstoreapp.service.impl;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.example.chainstoreapp.entity.Station;
import com.example.chainstoreapp.repository.StationMapper;
import com.example.chainstoreapp.service.StationNameService;

import lombok.RequiredArgsConstructor;

@Service // ビジネスロジックに付与する、インスタンス生成アノテーション
@RequiredArgsConstructor // finalが付けられたフィールドを引数とするコンストラクタを自動生成。かつ、コンストラクタが1つのみのとき、DIでインスタンスを受け取るコンストラクタを示す@Autowiredを省略可

//====== コントローラーのgetStationNamesで使うサービス ======
public class StationNameServiceImpl implements StationNameService {

//	MapperのDI
	private final StationMapper stationMapper;
	
	@Override
//	入力値を検索値として、駅名テーブルから駅名リストを取得
	public ArrayList<Station> getStationNames(String input) {
		
		ArrayList<Station> stations = stationMapper.selectByStation_Name("%" + input + "%", input + "駅", input + "%");
		
//		ArrayList<String> stationNames = new ArrayList<>();
//		for(Station station : stations) {
//			stationNames.add(station.getName_with_prefecture());
//		}
		
//		return stationNames;
		return stations;
	}

}
