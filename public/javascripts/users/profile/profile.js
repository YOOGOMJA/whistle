angular.module('whistleApp')
.factory('profileFactory' , function($http){
	return {
		get : function(){
			return $http({
				url : '/API/users/userinfo/default',
				method : 'get'
			});
		},
		update : function(data){
			return $http({
				url : '/API/users/userinfo',
				method : 'post',
				data : data
			});
		},
		unlink : function(sns_type){
			var _url = '';
			if(sns_type === 'facebook'){
				_url = '/API/users/unlink/facebook'
			}
			else if(sns_type === 'twitter'){
				_url = '/API/users/unlink/twitter'
			}
			else{
				throw 'sns_type이 잘못됐습니다'
			}
			
			return $http({
				url : _url,
				method : 'POST'
			});
		},
		pw_update : function(pw){
			return $http({
				url : '/API/users/password/update',
				method : 'POST',
				data : pw
			})
		}
	}
})
.controller('profileController' , ['$scope' , 'profileFactory' , function($s , fac){
	$s.val = {
		UI : {
			password : {
				confirm : false,
				visible : false,
				message : ''
			}
		},
		user : {},
		facebook : {},
		password : {
			origin : '',
			change : '',
			change_valid : ''
		}
	}
	
	$s.fn = {
		UI : {
			update : function(){
			 	if(confirm('수정사항은 즉각 적용됩니다. 이대로 수정할까요?'))
				{
					$s.fn.update();
				}
			},
			SNS : {
				facebook : function(){
					if($s.val.facebook && $s.val.facebook.TOKEN){
						if(confirm('페이스북 연결을 해제할까요?')){
							fac.unlink('facebook').success(function(obj){
								if(Number(obj.result) <= 0){
									alert('연결 해제가 실패했습니다. 다시 시도해주세요');
								}
								$s.fn.get();
							})
							.error(function(err){
								alert('연결 해제가 실패했습니다. 다시 시도해주세요');
								location.reload();
							});
						}
					}
					else{
						location.replace('/users/oauth/facebook');	
					}
				},
				twitter : function(){
					alert('TWITTER 연동');
				}
			},
			password : {
				update : function(){
					// 패스워드 변경
					// validation 체크 및 실제 업데이트 함수 실행
					$s.fn.pw_update();
				},
				show : function(state){
					$s.val.UI.password.confirm = state;
					if(!state){
						$s.val.password.origin = '';
						$s.val.password.change = '';
						$s.val.password.change_valid = '';
					}
				}
			}
		},
		get : function(){
			return fac.get().success(function(obj){
				if(Number(obj.result) <=  0){
					alert('회원 정보를 가져오는데 실패했습니다 잠시 후 다시 이용해주세요');
					return
				}
				
				$s.val.user = obj.info;
				$s.val.facebook = obj.facebook;
			}).error(function(err){
				console.log("Fail!!" , err);
			})
		},
		update : function(){
			return fac.update($s.val.user).success(function(obj){
				if(Number(obj.result > 0)){ 
					alert('수정되었습니다!'); 
				}
				else{
					alert('수정이 실패했습니다');
					console.log('ERR' , obj);
				}
				location.reload();
			})
		},
		pw_update : function(){
			return fac.pw_update($s.val.password).success(function(obj){
				if(obj.result > 0){
					alert('비밀번호가 변경됐습니다');
					$s.val.UI.password.message = obj.message;
					$s.UI.password.show(false);
				}
				else{
					$s.val.UI.password.message = obj.message;
					if(obj.result == -1) { location.reload(); }
				}
			});
		}
	}
	
	$s.fn.get();
}])