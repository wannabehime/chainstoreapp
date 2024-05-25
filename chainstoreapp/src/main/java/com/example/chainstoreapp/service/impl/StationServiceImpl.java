package com.example.chainstoreapp.service.impl;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.example.chainstoreapp.service.StationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StationServiceImpl implements StationService {

//	RestTemplateのDI
//	private final RestTemplate restTemplate;
	
	@Override
//	駅名データベースから、駅名の一部を手掛かりに駅名リストを取得
	public ArrayList<String> getStationNames(String term) {
		
//		String sample = "https://train.teraren.com/stations.json?station_name=\"青森\"";
//		String body = restTemplate.getForObject(sample, String.class);
//		System.out.println(body);
		
//		TODO: 仮のリスト
		ArrayList<String> stationNames = new ArrayList<>();
		stationNames.add("武蔵小金井駅");
		stationNames.add("山形駅");
		stationNames.add("新宿駅");
//		TODO: 現在地の場合
		if(term.equals("げん")){
			stationNames.add("現在地");
		}
		
		return stationNames;
	}

}
