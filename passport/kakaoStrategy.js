import passport from 'passport';
import passportKakao from 'passport-kakao';
import db from '../models/index.js';
const { Strategy: KakaoStrategy } = passportKakao;
const { User } = db;

export default () => {
  passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_ID,
    callbackURL: '/auth/login/kakao/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const exUser = await User.findOne({ where: { userid: profile.id, social_links: 'kakao' }});
      if (exUser) {
        done(null, exUser);
      } else {
        const newUser = await User.create({
          userid: profile.id,
          social_links: 'kakao',
          nickname: profile.username + profile.id,
          profile_image_url: profile._json.properties.thumbnail_image,
          email: profile._json.kakao_account.email
        });
        console.log('TEST>> ', newUser);
        done(null, newUser);
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};