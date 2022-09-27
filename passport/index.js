import passport from 'passport';
import kakao from './kakaoStrategy.js';
import google from './googleStrategy.js';
import db from '../models/index.js';
const { User } = db;

export default () => {
  passport.serializeUser((user, done) => {
    done(null, {id: user.id, nickname: user.nickname, profile_image_url: user.profile_image_url});
  });

  passport.deserializeUser(({id, nickname, profile_image_url}, done) => {
    User.findOne({ where: { id }})
      .then(user => done(null, user))
      .catch(err => done(err));
  });

  kakao();
  google();
}