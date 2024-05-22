import passport from "passport";
import GitHubStrategy from "passport-github2";
import User from "../dao/models/users.js";
import * as dotenv from "dotenv";

dotenv.config();

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL;

const gitHubPassport = () => {
    passport.use(
        "github",
        new GitHubStrategy(
        {
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            callbackURL: GITHUB_CALLBACK_URL
        },
        async function(accessToken, refreshToken, profile, done) {
            try {
                const email = profile?.emails[0]?.value;
                if (!email) {
                    return done(null, false, { message: "Email not found" });  
                }            
                const user = await User.findOne({email: email
                });
                if (!user) {
                const newUser = {
                    email: email,
                    password: Math.random().toString(36).substring(7),
                    role: "user"
                };
                let result = await User.create(newUser);
                return done(null, result);
                } else {
                return done(null, user);
                } 
        }
        catch (error) {
            done(error, null);
        }
        })
    );
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    
    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userService.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};

export default gitHubPassport;