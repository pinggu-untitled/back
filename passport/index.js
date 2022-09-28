import passport from 'passport';
import db from '../models/index.js';

export default () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await db.User.findOne({
        where: { id },
        attributes: ['id', 'nickname', 'profile_image_url'],
      });
      done(null, user);
    } catch (err) {
      console.error(err);
      done(err);
    }
  });
};
