import passport from 'passport';
import passportLocal from 'passport-local';
import { hashPassword, isValidPassword } from '../fileUtils.js';
import User from '../dao/models/users.js';

const LocalStrategy = passportLocal.Strategy;

const initializePassport = () => {
    passport.use(
        "register",
        new LocalStrategy(
            {
                passReqToCallback: true,
                usernameField: "email",
            },
            async (req, username, password, done) => {
                const { firstName, lastName, age, email } = req.body;
                try {
                    const user = await User.findOne({ email: username });
                    if (user) {
                        return done(null, false, { message: "User already exists" });
                    }
                    const newUser = new User({ 
                        firstName,
                        lastName,
                        age,
                        email, 
                        password: hashPassword(password) 
                    });
                    await newUser.save();
                    return done(null, newUser);
                } catch (error) {
                    return done(error);
                }
            }
        )
    )
};


passport.use(
    "login",
    new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: "email",
            passwordField: "password",
        },
        async (req, email, password, done) => {
            try {
                const user = await User.findOne({ email });
                
                if (!user) {
                    return done(null, false, { message: "User not found" });
                }
                
                if (!isValidPassword(user.password, password)) {
                    return done(null, false, { message: "Password incorrect" });
                }
                
                return done(null, user);
            } catch (error) {
                console.error("Error during login:", error);
                return done(error);
            }
        }
    )    
);
passport.use(
    "reset-password",
    new LocalStrategy(
        {
            usernameField: "token",
            passwordField: "newPassword",
            passReqToCallback: true
        },
        async (req, token, newPassword, done) => {
            try {
                const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
                if (!user) {
                    return done(null, false, { message: 'Password reset token is invalid or has expired' });
                }
                
                if (isValidPassword(user.password, newPassword)) {
                    return done(null, false, { message: 'New password cannot be the same as the old password' });
                }
                
                user.password = hashPassword(newPassword);
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                
                await user.save();
                return done(null, user);
            } catch (error) {
                console.error("Error during password reset:", error);
                return done(error);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user._id);
});
passport.deserializeUser(async (id, done) => {
    let user = await User.findById(id);
    done(null, user);
});

export default initializePassport