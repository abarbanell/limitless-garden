var user = require('../model/user');
var logger = require('../util/logger');

export class AuthSetup {
    public static isLocal(): boolean {
        return(process.env.ENVIRONMENT === "local")
    }

    public static logout(req: any) {
        if (AuthSetup.isLocal()) {
            let passportStub = require('passport-stub');
            passportStub.logout();
        } else {
            req.logout();
        }
    }

    public static setAuth(app: any): void {
        // encapsulate the authentication setup and strategy.
        // disable for environment "local"
        let passport = require('passport');

        // Passport session setup.
        //   To support persistent login sessions, Passport needs to be able to
        //   serialize users into and deserialize users out of the session.  Typically,
        //   this will be as simple as storing the user ID when serializing, and finding
        //   the user by ID when deserializing.  However, since this example does not
        //   have a database of user records, the complete Google profile is
        //   serialized and deserialized.
        passport.serializeUser(function (user, done) {
            logger.info('serialize user: ' + JSON.stringify(user));
            done(null, user);
        });

        passport.deserializeUser(function (obj, done) {
            logger.info('deserialize user: ' + JSON.stringify(obj));
            done(null, obj);
        });

        //set auth strategy
        if (AuthSetup.isLocal()) {
            // bypass authentication
            logger.info("authSetup only local, environment = ", process.env.ENVIRONMENT)
            let passportStub = require('passport-stub');
            passportStub.install(app);
        } else {
            logger.info("authSetup not local, environment = ", process.env.ENVIRONMENT)
            var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;



            // Use the GoogleStrategy within Passport.
            //   Strategies in Passport require a `verify` function, which accept
            //   credentials (in this case, an accessToken, refreshToken, and Google
            //   profile), and invoke a callback with a user object.
            passport.use(new GoogleStrategy({
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_RETURN_URL_HOST + '/auth/google/callback'
            },
                function (accessToken, refreshToken, profile, done) {
                    logger.info('callback from google: profile = %s', JSON.stringify(profile));
                    user.findOrCreate({ profile: profile }, function (err, user) {
                        return done(err, user);
                    });
                }
            ));
        }
        // Initialize Passport!  Also use passport.session() middleware, to support
        // persistent login sessions (recommended).
        app.use(passport.initialize());
        app.use(passport.session());
    }
}

