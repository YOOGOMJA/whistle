angular.module('whistleApp')
.controller('profileLayoutController' , ['$scope' , '$http' , function($s , $http){
	$s.val = {
		UI : {
			menu : 'profile'
		},
		user : {}
	}
	
	$s.fn = {
		UI : { },
		init : function(){
			var path = location.pathname.toLowerCase();
			if(path.indexOf('/profile') >= 0){ $s.val.UI.menu = 'PROFILE'; }
			else if(path.indexOf('/team') >= 0){ $s.val.UI.menu = 'TEAM'; }
			else{
				$s.val.UI.menu = 'UNKNOWN';
			}
			
			$s.fn.get();
		},
		get : function(){
			return $http({
				url : '/API/users/userinfo/header',
				method : 'get'
			}).success(function(obj){
				if(Number(obj.result) <= 0){
					alert('회원 정보를 가져오는데 실패했습니다 잠시 후 다시 이용해주세요');
					return
				}
				$s.val.user = obj.info;
			}).error(function(err){
				console.log("Fail!!" , err);
			})
		}
	}
	
	$s.fn.init();
}]).filter('inf_fullname' , function(){
	return function(user_info){
		if(!user_info['NAME']){  
			if(!user_info['EMAIL']){
				return '이름없음';
			} 
			else{
				return user_info['EMAIL'];
			}
		}
		else{
			var last = user_info['NAME']['LAST'];
			var first = user_info['NAME']['FIRST'];
			if(!last){ last = ''; }
			if(!first){ first = ''; }
			
			var concat = last.concat(' ' , first);
			return (concat.trim() == '') ? '이름없음' : concat;
		}
	}
}).filter('inf_pos_num' , function(){
	return function(user_info){
		var arr = [];
		if(user_info['POSITION']){ arr.push(user_info['POSITION']); }
		if(user_info['BACKNUMBER']){ arr.push(user_info['BACKNUMBER']); }
		
		return arr.join(',');
	}
})