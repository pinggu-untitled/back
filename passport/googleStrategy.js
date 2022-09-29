import passport from 'passport';
import passportGoogle from 'passport-google-oauth20';
import emojiRegex from 'emoji-regex';
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
        const nickname = profile.displayName;
        const regex = emojiRegex();
        let emoji = '';
        for (const match of nickname.matchAll(regex)) {
          emoji += match[0];
        }

        let newNickname = '';
        if (emoji.length !== 0) {
          const emoRegex = new RegExp(`[${emoji}]`, 'g');
          newNickname = nickname.replace(emoRegex, '');
        }

        const newUser = await User.create( {
          userid: profile.id,
          social_links: 'google',
          nickname: newNickname + profile.id,
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