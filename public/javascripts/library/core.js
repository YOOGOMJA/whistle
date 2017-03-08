window['whistle'] = {
	init : function(target , fns){
		if(window[target]){
			for(fn in fns){
				if(fn){ window[target]['prototype'][fn] = fns[fn]; }
			}
		}
	},
	isExist : function(obj , empty_check){
		if(!obj || !obj ){ return false; }
		else{
			if(empty_check){
				if(obj == ''){ return false; }
				else { return true; }
			}
		}
	}
}