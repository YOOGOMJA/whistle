/**
 * Created by Yoo on 2015-10-09.
 */

// expose our config directly to our application using module.exports

module.exports = {
    facebookAuth : {
        clientID		: "1505432663113455",
        clientSecret	: "2881a48471602ce88c4983835ae23468",
        callbackURL		: "http://localhost:3000/users/oauth/facebook/callback",
        profileFields	: ["id" , "email" , "gender" , "name" ]
    },
    twitterAuth	: {
        consumerKey		: "key",
        consumerSecret	: "client secret",
        callbackURL		: "http://localhost:3000/oauth/twitter/callback"
    }
}