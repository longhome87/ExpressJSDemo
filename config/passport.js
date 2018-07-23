const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    
});