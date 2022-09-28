export const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.status(401).send('로그인 사용자만 접근 가능');
  }
};

export const isNotLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.status(401).send('로그인하지 않은 사용자만 접근 가능');
  } else {
    next();
  }
};
