const router = require("koa-router")();
const userController = require("./users/userController");

router.post("/api/user/login", userController.login);

module.exports = router;
