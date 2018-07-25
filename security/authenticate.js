class Authenticate {
    static isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        res.redirect('/');
    };

    static notLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }

        res.redirect('/');
    };
}

module.exports = Authenticate;