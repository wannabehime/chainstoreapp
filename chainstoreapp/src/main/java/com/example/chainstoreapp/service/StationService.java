package com.example.chainstoreapp.service;

import java.util.ArrayList;

import com.example.chainstoreapp.entity.Station;

// ====== コントローラーのgetStationsで使うサービスのインターフェース ======
public interface StationService {
	
//	------ 入力値から、候補となる駅リストを取得 ------
	ArrayList<Station> getStations(String input);
	
}
