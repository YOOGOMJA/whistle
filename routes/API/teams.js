var express = require('express');
var router = express.Router();

var teams = require('../../db/teams.js');

module.exports = function(passport){
	if(!passport){ throw "THIS MODULE NEEDS PASSPORT"; }

	
	function isAuth(req , res, next){
		if(req.isAuthenticated()){ return next(); }
		else{ res.json({ result : -1 , message : '세션이 유효하지 않음' }); }	
	}
	
	router.get('/teaminfo/:type' , isAuth , function(req , res){
		
	});
	
	
	router.post('/create' , isAuth , function(req , res){
		// 1. 팀을 생성하고 
		// 2. 생성자의 ID를 팀의 주장으로 등록
		// 3. 현재 팀의 ID를 생성자의 팀 ID로 등록 
		console.log(req.body);
	});
	
	router.post('/update' , isAuth , function(req , res){
		
	});
	
	router.post('/delete' , isAuth , function(req , res){
		// 팀 테이블에서 해당 ID를 삭제하고 
		// 유저테이블에서 해당 ID를 가진 회원을 모두 조회하고 
		// 팀항목의 ID와 이름을 삭제함  
	});
	
	router.post('/subs/insert' , isAuth , function(req , res){
		
	});
	
	router.post('/subs/update' , isAuth , function(req , res){
		
	});
	
	router.post('/subs/remove' , isAuth , function(req , res){
		
	});
	
	
}