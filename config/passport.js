const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/User');

module.exports = (passport) => {
    const opts = {
        jwtFromRequest: (req) => req.cookies.jwt, // Extract token from cookie
        secretOrKey: process.env.JWT_SECRET
    };

    passport.use(
        new JwtStrategy(opts, async (jwt_payload, done) => {
            try {
                const user = await User.findById(jwt_payload.id);
                if (user) {
                    return done(null, user);
                }
                return done(null, false);
            } catch (error) {
                return done(error, false);
            }
        })
    );
};

