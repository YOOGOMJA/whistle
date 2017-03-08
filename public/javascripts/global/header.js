angular.module('whistleApp')
.controller('mainNavController' ,[ "$scope" , '$http' , function($s , $http){
	$s.val = {
		info : {}
	}
	
	$s.fn = {
		init : function(){
			return $http({
				url : '/API/users/userinfo/header',
				method : 'GET'
			})
			.success(function(data){
				if(Number(data.result) > 0){
					$s.val.info = data.info;
					var nm = [];
					if(data.info.NAME.LAST){ nm.push(data.info.NAME.LAST); }
					if(data.info.NAME.FIRST){ nm.push(data.info.NAME.FIRST); }
					$s.val.info.FULLNAME = nm.join(' ');
				}
				else{
					alert('회원 정보 조회가 실패했습니다. 잠시후 다시 시도해주세요');
				}
			})
			.error(function(e){
				if(e){ console.log("ERROR RAISED!!" , e); }
			});
		}
	}
	
	
	$s.fn.init();
}]);