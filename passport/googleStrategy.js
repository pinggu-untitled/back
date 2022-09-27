import passport from 'passport';
import passportGoogle from 'passport-google-oauth20';
import db from '../models/index.js';
const { Strategy: GoogleStrategy } = passportGoogle;
const { User } = db;

export default () => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: '/auth/login/google/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const exUser = await User.findOne({ where: { userid: profile.id, social_links: 'google' }});
      if (exUser) {
        done(null, exUser);
      } else {
        const newUser = await User.create( {
          userid: profile.id,
          social_links: 'google',
          nickname: profile.displayName + profile.id,
          profile_image_url: profile.photos[0].value,
          email: profile.emails[0].value
        });
        done(null, newUser);
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};