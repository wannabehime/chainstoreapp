package com.example.chainstoreapp.service;

import java.util.ArrayList;

public interface StationService {
	
//	駅名の一部分を手掛かりに駅名リストを取得
	ArrayList<String> getStationNames(String term);

}
