import { Router } from 'express';
import passport from 'passport';
const { PINGGU_HOST } = process.env;

const router = Router();

/* 카카오 로그인 */
router.get('/login/kakao', passport.authenticate('kakao'));
/* 카카오 로그인 콜백 */
router.get(
  '/login/kakao/callback',
  passport.authenticate('kakao', {
    failureRedirect: '/',
  }),
  (req, res) => {
    // res.redirect('https://localhost');
    // res.redirect('http://localhost:3000');
    res.redirect(PINGGU_HOST);
  },
);

/* 구글 로그인 */
router.get(
  '/login/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),
);
/* 구글 로그인 콜백 */
router.get(
  '/login/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
  }),
  (req, res) => {
    // res.redirect('https://localhost');
    // res.redirect('https://pinggu.life');
    res.redirect(PINGGU_HOST);
  },
);

/* 로그아웃 */
router.get('/logout', (req, res) => {
  if (req.user.social_links === 'kakao') {
    const LOGOUT_REDIRECT_URI = 'http://localhost:8080/auth/logout/kakao/callback';
    res.redirect(
      `https://kauth.kakao.com/oauth/logout?client_id=${process.env.KAKAO_ID}&logout_redirect_uri=${LOGOUT_REDIRECT_URI}`,
    );
  } else {
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy();
      // res.redirect('https://localhost');
      res.redirect(PINGGU_HOST);
      // res.redirect('https://pinggu.life');
    });
  }
});
/* 카카오 로그아웃 콜백 */
router.get('/logout/kakao/callback', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy();
    // res.redirect('https://localhost');
    // res.redirect('https://pinggu.life');
    res.redirect(PINGGU_HOST);
  });
});

export default router;
