package com.example.chainstoreapp.service.impl;

import java.util.ArrayList;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.chainstoreapp.entity.Station;
import com.example.chainstoreapp.repository.StationMapper;
import com.example.chainstoreapp.service.StationService;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class StationServiceImpl implements StationService {

//	MapperのDI
	private final StationMapper stationMapper;
	
	@Override
//	駅名データベースから、駅名の一部を手掛かりに駅名リストを取得
	public ArrayList<String> getStationNames(String input) {
		
		ArrayList<Station> stations = stationMapper.selectByStation_Name("%" + input + "%", input + "駅", input + "%");
		
		ArrayList<String> stationNames = new ArrayList<>();
		for(Station station : stations) {
			stationNames.add(station.getName_with_prefecture());
		}
		
		return stationNames;
	}

}
