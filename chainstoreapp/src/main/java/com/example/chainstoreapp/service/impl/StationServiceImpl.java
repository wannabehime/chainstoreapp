package com.example.chainstoreapp.service.impl;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.example.chainstoreapp.entity.Station;
import com.example.chainstoreapp.repository.StationMapper;
import com.example.chainstoreapp.service.StationService;

import lombok.RequiredArgsConstructor;

@Service
//@Transactional
@RequiredArgsConstructor
public class StationServiceImpl implements StationService {

//	MapperのDI
	private final StationMapper stationMapper;
	
	@Override
//	駅名データベースから、駅名の一部を手掛かりに駅名リストを取得
	public ArrayList<String> getStationNames(String term) {
		
		ArrayList<Station> stations = stationMapper.selectByStation_Name("%" + term + "%", term + "駅", term + "%");
		
		ArrayList<String> stationNames = new ArrayList<>();
		for(Station station : stations) {
			stationNames.add(station.getName_with_prefecture());
		}
//		stationNames.add(0, "武蔵小金井駅");
		
		return stationNames;
	}

}
