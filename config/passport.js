const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

module.exports = (passport, user) => {
	const User = user;
	passport.use(
		new LocalStrategy({
			usernameField: 'email'
		}, (email, password, done) => {
			User.findOne({
					where: {
						email: email
					}
				})
				.then(user => {
					if (!user) {
						return done(null, false, {
							message: 'User doesn\'t exist!'
						});
					}
					if (crypto.createHash('md5').update(password).digest('hex') == user.password) {
						return done(null, user);
					} else {
						return done(null, false, {
							message: 'Wrong password! Please try again.'
						});
					}
				});
		})
	);

	passport.serializeUser((user, done) => {
		done(null, user);
	});

	passport.deserializeUser((id, done) => {
		done(null, id);
	});
};