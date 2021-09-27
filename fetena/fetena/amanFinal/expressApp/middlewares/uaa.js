const jwtManager = require("../jwt/jwtManager");

class Uaa {
  checkToken(req, res, next) {
    if (req.url === "/auth/login" || req.url === "/auth/signup") {
      next();
      return;
    }
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ status: "auth_error" });
    } else {
      const data = jwtManager.verify(token);
      if (!data) {
        return res.json({ status: "auth_error" });
      }
      console.log("datatatat", data);
      req.email = data.email;
      req.name = data.name;

      next();
    }
  }

  // authenticateBook(req, res, next) {
  //     if (req.method === 'POST'
  //         || req.method === 'PUT'
  //         || req.method === 'DELETE') {
  //         if (req.role !== 'librarian') {
  //             return res.json({ status: 'auth_error' });
  //         }
  //     }
  //     next();
  // }
}

module.exports = new Uaa();
