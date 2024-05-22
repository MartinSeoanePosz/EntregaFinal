function auth(req, res, next) {
    if (req.session) {
      if (req.session.role === "admin") {
        if (req.originalUrl === "/users") {
          return next();
        }
        if (req.originalUrl === "/products" || req.originalUrl === "/chat") {
          return res.sendStatus(401);
        }
        return next();
      }
      if (req.session.role === "premium") {
        return next();
      }
      if (req.session.role === "user") {
        if (req.originalUrl === "/realtime/" || req.originalUrl === "/realtime") {
          return res.sendStatus(401);
        }
        return next();
      }
    }
    return res.sendStatus(401);
  }
  
  export default auth;
  