var express = require('express');
var router = express.Router();

function isAuth(req , res, next){
	if(req.isAuthenticated()){
		res.redirect('/users/profile');
	}
	else{
		return next();
	}
}

/* GET home page. */
router.get('/' , isAuth , function(req, res, next) {
	res.render('index', { title: 'Express'});
});

module.exports = router;