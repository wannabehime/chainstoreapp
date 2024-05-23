package com.example.chainstoreapp.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

//検索の中心地入力の際の、サジェストする駅名エンティティ
public class Station {
	
//	ID
	private int id;
	
//	駅名
	private String name;
	
//	振り仮名
	private String pronunciation;

}
