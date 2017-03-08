window['view'] = {
	animate : false,
	init : function(){
		$('.cover-container #div_intro').show();
		$('.cover-container #div_signin').hide();
		$('.cover-container #div_signup').hide();
	},
	toggle : function(origin , target){
		if($(target).is(':visible')){ 
			console.log('this object is already visible'); 
			return;
		}
		
		if(window['view'].animate){ console.log('already animate'); return; }
		window["view"].animate = true;
		$(origin).animate({
			"margin-left" : '90',
			opacity : 0
		},300 , function(){
			$(origin).hide();
			
			$(target).css('margin-left' , '-90px');
			$(target).css('display' , 'block');
			$(target).css('opacity' , '0');
			$(target).animate({
				"margin-left" : 0,
				opacity : 1,
			} , 300 , function(){
				window["view"].animate = false;
			})
		});
	},
	show : function(mode){
		var cur = $('.cover-container .cover:visible');
		var target;
		
		if(mode == 0) 
		{ 	// index 
			target = document.getElementById('div_intro');
		}
		else if(mode == 1)
		{	// signin
			target = document.getElementById('div_signin');
		}	
		else
		{	// signup
			target = document.getElementById('div_signup');
		}
		this.toggle(cur.get(0) , target);
	}
}

window['view'].init();