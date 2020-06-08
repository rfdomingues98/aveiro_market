module.exports = {
	ensureCustomer: (req, res, next) => {
		if (req.user.userType == 0) {
			return next();
		}
		res.status(401).redirect('/');
	},
	ensureSeller: (req, res, next) => {
		if (req.user.userType == 1) {
			return next();
		}
		res.status(401).redirect('/');
	},
	ensureAuthenticated: (req, res, next) => {
		if (req.isAuthenticated()) {
			return next();
		}
		req.flash('warning_msg', 'Please login to your account in order to proceed!');
		res.redirect('/');
	},
	forwardAuthenticated: function (req, res, next) {
		if (!req.isAuthenticated()) {
			return next();
		}
		res.redirect('/users/dashboard');
	}
}