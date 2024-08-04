package com.example.chainstoreapp.service;

import java.util.ArrayList;

import com.example.chainstoreapp.entity.Station;

// ====== コントローラーのgetStationNamesで使うサービスのインターフェース ======
public interface StationService {
	
//	------ 入力値から、候補となる駅名リストを取得 ------
//	ArrayList<String> getStationNames(String input);
	ArrayList<Station> getStations(String input);
	
}
