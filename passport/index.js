import passport from "passport";
import local from "./local.js";
import db from "../models/index.js";

export default () => {
  // 세션 저장용 db로 redis 사용
  //cookie-session: user.id
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await db.User.findOne({
        where: { id },
        attributes: ["id", "nickname", "profile_image_url"],
      });
      done(null, user); // req.user
    } catch (err) {
      console.error(err);
      done(err);
    }
  });

  local();
};
