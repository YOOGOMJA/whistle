// LOAD PASSPORT STRATEGY
var LocalStrategy = require("passport-local").Strategy;
var FacebookStrategy = require("passport-facebook").Strategy;
var configAuth = require("./auth.js");
// MODEL
var User = require("../db/users.js");

module.exports = function(passport){
	
	passport.serializeUser(function(user , done){
		done(null , user.id);
	});
	
	passport.deserializeUser(function(id , done){
		User.findById(id , function(err , user){
            done(err , user);
        })
	});
	
	// ===========================
	// LOCAL
	// ===========================
	passport.use("local-signup" , new LocalStrategy({
		usernameField : "inputEmail",
		passwordField : "inputPassword",
		passReqToCallback : true
	} , function(req , email , password , done){
		
		process.nextTick(function(){

			// 패스워드 Valid체크 
			var body = req.body;

			if(body.inputPassword.trim() != body.inputPassword_valid){
				return done(null , false, req.flash('signupMessage' , '패스워드가 일치하지 않습니다'));
			}
			if(!User.secureCheck(body.inputPassword)){
				return done(null , false, req.flash('signupMessage' , '유효한 패스워드가 아닙니다 규칙을 확인해주세요'));
			}
			
			User.findOne({ "LOCAL.EMAIL" : email } , function(err , user){
				if(err){ done(err); }
				if(user){ return done(null , false , req.flash("signupMessage" , "이 이메일은 이미 사용중입니다")); }
				else{
					var newbie = new User();
					newbie.LOCAL.EMAIL = email;
					newbie.LOCAL.PASSWORD = newbie.generateHash(password);
					newbie.INFO.EMAIL = email;
						
					newbie.save(function(err){
						if(err){ throw err; }
						return done(null , newbie);
					});
				}
			});
		});
	}));
	
	passport.use("local-login" , new LocalStrategy({
		usernameField : "inputEmail",
		passwordField : "inputPassword",
		passReqToCallback : true
	} , function(req , email , password , done){
		
		User.findOne({ "LOCAL.EMAIL" : email } , function(err , user){
			if(err){ return done(err); }
			if(!user){ return done(null , false , req.flash( "loginMessage" ,  "잘못되거나 없는 이메일입니다")); }
			if(!user.validPassword(password)){
				return done(null , false , req.flash( "loginMessage" , "패스워드가 잘못됐습니다" ));
			}
			
			return done(null , user);
		});
		
	}));
	
	// ===========================
	// FACEBOOK 
	// ===========================
	
	passport.use(new FacebookStrategy({
        clientID	: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL : configAuth.facebookAuth.callbackURL,
        profileFields : configAuth.facebookAuth.profileFields,
        passReqToCallback : true
    }, function(req , token , refreshToken , profile , done){
        process.nextTick(function(){
            console.log("FACEBOOK !!" , profile);

            if(!req.user){
                User.findOne({ "FACEBOOK.ID" : profile.id } , function(err , user){
                    if(err){ return done(err); }
                    if(user){
                        if(!user.FACEBOOK.TOKEN){
                            user.FACEBOOK.TOKEN = token;
                            user.FACEBOOK.EMAIL = profile.emails[0].value;
							
							if(!user.INFO.NAME){
								user.INFO.NAME['LAST'] = profile.familyName;
								user.INFO.NAME['FIRST'] = profile.name.givenName;
							}
							else{
								if(!user.INFO.LAST) { 
									user.INFO.NAME.LAST = profile.name.familyName;
                            	}
								if(!user.INFO.NAME.FIRST){
									user.INfO.NAME.FIRST =  profile.name.givenName;
								}
							}
							if(!user.INFO.EMAIL || user.INFO.EMAIL.trim() === ''){
								user.INFO.EMAIL = profile.emails[0].value;	
							}
							
                            user.save(function(err){
                                if(err){ throw err; }
                                return done(null , user);
                            })
                        }
                        return done(null , user);
                    }
                    else{
                        var newbie = new User();
                        newbie.FACEBOOK.ID = profile.id;
                        newbie.FACEBOOK.TOKEN = token;
                        newbie.FACEBOOK.EMAIL = profile.emails[0].value;
						newbie.INFO.EMAIL = profile.emails[0].value;
						newbie.INFO.NAME= {
							LAST : profile.name.givenName,
							FIRST : profile.name.familyName
						}
						
                        newbie.save(function(err){
                            if(err){ throw err; }

                            return done(null , newbie);
                        })
                    }
                })
            }
            else{
                var user = req.user;
                user.FACEBOOK.ID = profile.id;
                user.FACEBOOK.TOKEN = token;
                //user.FACEBOOK.NAME = profile.name.givenName + " " + profile.name.familyName;
                user.FACEBOOK.EMAIL = profile.emails[0].value;

                user.save(function(err){
                    if(err){ throw err; }
                    return done(null , user);
                });
            }
        });
	}));
	
}
