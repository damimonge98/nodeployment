const isUser = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ msg: "You are not logged in." });
  }
};

const isSuperAdmin = (req, res, next) => {
  if (req.user && req.user.isSuperAdmin) {
    next();
  } else {
    return res.status(401).json({ msg: "You are not a super admin." });
  }
};

module.exports = {
  isUser,
  isSuperAdmin
};
