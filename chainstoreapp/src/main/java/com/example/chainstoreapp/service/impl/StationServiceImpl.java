package com.example.chainstoreapp.service.impl;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.example.chainstoreapp.entity.Station;
import com.example.chainstoreapp.repository.StationMapper;
import com.example.chainstoreapp.service.StationService;

import lombok.RequiredArgsConstructor;

@Service // ビジネスロジックに付与する、インスタンス生成アノテーション
@RequiredArgsConstructor // finalが付けられたフィールドを引数とするコンストラクタを自動生成。かつ、コンストラクタが1つのみのとき、DIでインスタンスを受け取るコンストラクタを示す@Autowiredを省略可

//====== コントローラーのgetStationsで使うサービス ======
public class StationServiceImpl implements StationService {

//	MapperのDI
	private final StationMapper stationMapper;
	
	@Override
//	入力値を検索値として、駅テーブルから駅リストを取得
	public ArrayList<Station> getStations(String input) {
		ArrayList<Station> stations = stationMapper.selectByStation_Name("%" + input + "%", input + "駅", input + "%");
		return stations;
	}

}
