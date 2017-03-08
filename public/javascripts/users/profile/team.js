angular.module('whistleApp')
.factory('teamFactory' , function($http){
	return {
		get : {
			user : function(){
				return $http({
					url : '/API/users/userinfo/info',
					method : "GET"
				}).error(function(){
					alert('조회중 오류가 발생했습니다. 잠시후 다시시도해주세요');
				});
			},
			team : function(){
				console.log("TEAM GET CALL");
			}
		},
		update : {
			team : function(){
				
			},
			subs : function(){
				
			}
		}
	};
})
.controller('teamController' , ['$scope' , 'teamFactory' , function($s, fac){
	$s.val = {
		dic : {
			mode : [  
				'NO-TEAM', // 팀 없음 경고 창
				'CREATE' , // 팀 생성 
				'SEARCH'  // 팀 찾기
			]	
		},
		UI : {
			hasTeam : false,
			mode : 'NO-TEAM',
			team_nm_search : '',
			team_nm_create : ''
		},
		user : {},
		team : {}
	}
	
	$s.fn = {
		UI : {
			clear : {
				alert : function(){
					$s.val.UI.team_nm_search = '';
					$s.val.UI.team_nm_create = '';
				}
			},
			changeMode : function(mode){
				if(!mode || mode == '' || mode.length <= 0){
					throw 'MODE가 잘못되었습니다.';
				}
				else if($s.val.dic.mode.indexOf(mode.toUpperCase()) < 0){
					throw '등록되지 않은 MODE입니다.';
				}
				else 
				{ 
					$s.val.UI.mode = mode.toUpperCase(); 
					if($s.val.UI.mode == 'NO-TEAM'){ 
						$s.fn.UI.clear.alert();
					}
				}
			}
		},
		user : {
			get : function(){
				return fac.get.user().success(function(data){
					if(data.result && Number(data.result) > 0){
						$s.val.user = data.info;
						console.log($s.val.user);
					}
					else{
						alert('조회중 오류가 발생했습니다. 잠시후 다시시도해주세요');
					}
				});
			}	
		},
		team : {
			get : function(){
				alert("!!");
			},
			create : function(){
				if(window['whistle'].isExist($s.val.UI.team_nm_create)){
					alert('있음')
				}
				else{
					alert('없음')
				}
			}
		},
		init : function(){
			// 개인정보를 먼저 가져옴
			$s.fn.user.get().then(function(){
				if(!$s.val.user.TEAM || !$s.val.user.TEAM.ID){
					console.log("팀정보 없음 , 팀생성 요망");
				}
				else{
					console.log("팀정보 있음 , 팀 화면 표기");
				}
			})	
		}
	}
	
	$s.fn.init();
}])