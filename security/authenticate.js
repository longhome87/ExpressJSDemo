class Authenticate {
    static isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        req.session.oldUrl = req.url;
        res.redirect('/');
    };

    static notLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }

        res.redirect('/');
    };

    static hasLoggedIn(routeName, req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        req.session.oldUrl = routeName;
        res.redirect('/users/signin');
    };
}

module.exports = Authenticate;