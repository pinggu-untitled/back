// import passport from "passport";
// import { Strategy as LocalStrategy } from "passport-local";
// import db from "../models/index.js";
// import bcrypt from "bcrypt";

// export default () => {
//   passport.use(
//     new LocalStrategy(
//       {
//         usernameField: "email", //req.body.email
//         passwordField: "password", //req.body.password
//       },
//       async (email, password, done) => {
//         try {
//           const existingUser = await db.User.findOne({ where: { email } });

//           if (!existingUser)
//             return done(null, false, { reason: "가입되지 않은 사용자입니다." }); //클라이언트 에러

//           const match = await bcrypt.compare(password, existingUser.password);

//           if (!match)
//             return done(null, false, { reason: "잘못된 비밀번호입니다." });

//           return done(null, existingUser);
//         } catch (err) {
//           //서버 에러
//           console.error(err);
//           return done(err);
//         }
//       }
//     )
//   );
// };
