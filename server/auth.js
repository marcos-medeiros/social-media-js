const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcryptjs');
const User = require('./models/user');

passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        User.findOne({ email }, (err, user) => {
            if (err) done(err);
            if (!user) done(null, false, { msg: "Incorrect email" });
            bcrypt.compare(password, user.password, (err, res) => {
                // passwords match! log user in
                if (res) done(null, user);
                // passwords do not match!
                else done(null, false, { msg: "Incorrect password" });
            });
        });
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
});

module.exports = passport;