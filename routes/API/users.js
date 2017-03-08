var express = require("express");
var router = express.Router();

var users = require('../../db/users.js');

module.exports = function(passport){
	if(!passport){ throw "THIS MODULE NEEDS PASSPORT MODULE!!"; }
	

	function isAuthenticated(req , res, next){
		if(req.isAuthenticated()){
			return next();
		}
		else{
			res.json({ 'result' : -1 , 'message' : '세션이 유효하지 않음' });
		}
	}
	
	// CONNECTION 
	router.get("/logout" , function(req , res, next){
		req.logout();
		res.json({ "result" : 1 });
	});
	
	// PASSPORT AUTHENTICATE
	
	// 1. LOCAL
	
	router.post("/login" , passport.authenticate("local-login" , {session : false }) , function(req , res){
		if(req.isAuthenticated()){
			res.json({"result" : 1 , "user" : req.user });	
		}
		else{
			res.json({"result" : 0 , "user" : {} });
		}
	});
	
	router.post("/signup" , passport.authenticate("local-signup" , { session : false } , function(req , res){
		if(req.isAuthenticated()){ 
			res.json({"result" : 1 , "user" : req.user});
		}
		else{
			res.json({"result" : 0 , "user" : {} });
		}
	}));
	
	// UNLINK
	
	router.post("/unlink/facebook" , isAuthenticated , function(req , res){
		var user = req.user;
		user.FACEBOOK.TOKEN = undefined;
		user.save(function(err){
			if(err){ throw err; }
			res.json({"result" : 1 });
		});
	});
	
	
	// USER INFO GET
	//router.get('/info' , isAuthenticated, function(req , res){
	//	res.json({ 'result' : 1 , info : req.user.INFO , facebook : req.user.FACEBOOK , twitter : req.user.TWITTER});
	//});
	router.get('/userinfo/:type' , isAuthenticated , function(req , res){
		var type = req.params.type ? (req.params.type + "").trim().toLowerCase() : undefined; 
		console.log("POST! : " + req.params.type + " / " + type);
		if(!type || type == 'default'){
			res.json({ 'result' : 1 , info : req.user.INFO , facebook : req.user.FACEBOOK , twitter : req.user.TWITTER });
		}
		else if(type == 'header'){
			res.json({ 'result' : 1 , info : {
				NAME : req.user.INFO.NAME,
				POSITION : req.user.INFO.POSITION,
				BACKNUMBER : req.user.INFO.BACKNUMBER,
				TEAM : req.user.INFO.TEAM,
				PROFILE_IMG : req.user.INFO.PROFILE_IMG,
				PROFILE_IMG_COV : req.user.INFO.PROFILE_IMG_COV
			} });
		}
		else if(type == 'info'){
			res.json({ 'result' : 1 , info : req.user.INFO });
		}
		else if(type == 'facebook'){
			res.json({ 'result' : 1 , facebook : req.user.FACEBOOK });
		}
		else if(type == 'twitter'){
			res.json({ 'result' : 1  , twitter : req.user.TWITTER });
		}
	});
	
	router.get('/teaminfo/' , isAuthenticated , function(req , res){
		// teaminfo 조회
	})
	
 	// USER INFO UPDATE 
	
	router.post('/userinfo' , isAuthenticated , function(req , res){
		users.findOne({ '_id' : req.user._id } , function(err , user){
			if(!user){ res.json({'result' : -2 , 'message' : 'USER가 존재하지 않음'}); }
			else{
				// 이름 저장 
				if(req.body['NAME']){
					user['INFO']['NAME'] = req.body['NAME']
				}
				if(req.body['POSITION']){
					user['INFO']['POSITION'] = req.body['POSITION'];
				}
				if(req.body['HEIGHT'] && isNaN(req.body['HEIGHT'])){
					user['INFO']['HEIGHT'] = req.body['HEIGHT'];
				}
				if(req.body['WEIGHT'] && isNaN(req.body['WEIGHT'])){
					user['INFO']['WEIGHT'] = req.body['WEIGHT'];
				}
				user['MODIFIED_DT'] = new Date();
				user['MODIFIED_ACC_NO'] = req.user._id;
				
				user.save(function(err){
					if(err){ res.json({'result' : -3 , 'message' : 'DB 저장중 오류가 발생함 ' , 'err' : err}); }
					else{
						res.json({'result' : 1 });
					}
				});
			}
		})
	 });
	
	router.post('/password/update' , isAuthenticated , function(req , res){
		console.log(req.body)
		if(req.user.validPassword(req.body.origin)){
			if(!req.body.change || !req.body.change_valid){
				res.json({'result' : -2 , 'message' : '변경할 패스워드가 입력되지 않았습니다'});
				return this;
			}
			req.body.change = req.body.change.trim();
			req.body.change_valid = req.body.change_valid.trim();
			
			// 01. 패스워드 , 패스워드 확인 항목이 같은지 체크
			if(req.body.change != req.body.change_valid){
				res.json({'result' : -2 , 'message' : '패스워드 확인이 실패했습니다 '});
				return this;
			}
			// 02. 패스워드 안정성 체크 
			if(req.user.secureCheck(req.body.change)){
				// 03. 유저 찾기 
				users.findOne({ _id : req.user._id } , function(err , user){
					if(err){ res.json({ result : -3 , message : 'DB 오류가 발생했습니다' , err : err }); }
					else{
						// 04. 실제 패스워드 업데이트 
						user.LOCAL.PASSWORD = user.generateHash(req.body.change);
						user.save(function(err){
							if(err){ res.json({ result : -3 , message : 'DB 오류가 발생했습니다' , err : err }); }
							else{
								res.json({ result : 1 });
							}
						})
					}
				})
			}
			else{
				res.json({result : -2 , message : '패스워드 유효성 체크가 실패했습니다' });
				return this;
			}
			
			
		}
		else{
			res.json({ result : -2 , message : '기존 비밀번호가 올바르지 않습니다'});
		}
	});
	
	
	return router;
}