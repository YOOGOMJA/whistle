var express = require('express');
var router = express.Router();

module.exports = function(passport){
	if(!passport){ throw "THIS MODULE NECESSARY APP's PASSPORT"; }

	function isAuthenticated(req , res , next){
		if(!req.isAuthenticated()) { res.redirect("/users/signin"); }
		else {
			return next();
		}
	}
	
	// # VIEW ROUTE
	router.get('/' , isAuthenticated, function(req , res, next){
		res.redirect("/users/profile");
	});
	
	router.get("/signin" , function(req , res, next){
		res.render('./users/signin.jade' , { message : req.flash("loginMessage") });
	});
	
	router.get("/signup" , function(req , res, next){
		res.render('./users/signup.jade' , { message : req.flash('signupMessage') });
	})
	
	router.get("/profile" , isAuthenticated , function(req , res, next){
		res.render('./users/profile/profile.jade');
	});
	
	router.get('/team' , isAuthenticated , function(req , res, next){
		res.render('./users/profile/team.jade');
	})

	router.get("/logout" , isAuthenticated , function(req , res, next){
		req.logout();
		res.redirect("/");
	});

	// PASSPORT AUTHENTICATE
	// 1. LOCAL
	
	router.post("/signin", passport.authenticate("local-login" , {
		successRedirect : "/users/profile",
		failureRedirect : "/users/signin",
		failureFlash : true
	}));
	
	router.post("/signup",  passport.authenticate("local-signup" , {
		successRedirect : "/users/profile",
		failureRedirect : "/users/signup",
		failureFlash : true
	}));
	
	// 2. FACEBOOK
	router.get("/oauth/facebook", passport.authenticate("facebook", { scope : "email" }));
	router.get("/oauth/facebook/callback", passport.authenticate("facebook", {
		successRedirect : "/users/profile",
		failureRedirect : "/"
	}));

	// ========================
	// PASSPORT AUTHORIZE
	// ========================
	// 1. LOCAL
	router.get("/connect/local" , function (req, res){
		res.render("./users/connect-local", { message : req.flash("loginMessage") });
	});
	
	router.get("/connect/local", passport.authenticate("local-signup", {
		successRedirect : "/users/profile",
		failureRedirect : "/users/connect/local",
		failureFlash : true
	}));

	// 2. FACEBOOK
	router.get("/connect/facebook", passport.authorize("facebook", { scope : "email" }));
	router.get("/connect/facebook/callback", passport.authorize("facebook", {
		successRedirect : "/users/profile",
		failureRedirect : "/users"
	}));
	
	
	// ========================
	// PASSPORT UNLINK
	// ========================
	// 1. LOCAL
	router.post("/unlink/local", function (req, res){
		var user = req.user;
		user.local.email = undefined;
		user.local.password = undefined;
		user.save(function(err){
			if (err) { throw err; }
			res.redirect("/users/profile");
		});
	});

	// 2. FACEBOOK
	router.post("/unlink/facebook", function (req, res){
		var user = req.user;
		user.FACEBOOK.TOKEN = undefined;
		user.save(function(err){ 
			if(err){ throw err; }
			res.redirect("/users/profile");
			
		});
	});
	
	return router;
}
