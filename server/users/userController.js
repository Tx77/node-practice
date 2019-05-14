const mysql = require("../../config/mysql");

class UserController {
  /**
   * 用户登录
   * @param {*} ctx
   * @param {*} next
   */
  static async login(ctx, next) {
    let phoneNumber = ctx.request.body.phoneNumber || "";
    let password = ctx.request.body.password || "";
    let responseBody = {};
    return new Promise((resolve, reject) => {
      if (phoneNumber && password) {
        mysql
          .knex("users")
          .where({
            phone_number: phoneNumber,
            password: password
          })
          .then(res => {
            if (res.length > 0) {
              Object.assign(responseBody, {
                apiStatus: 0,
                sysStatus: 0,
                data: {},
                info: "登陆成功"
              });
              ctx.body = responseBody;
              resolve();
            } else {
              Object.assign(responseBody, {
                apiStatus: 0,
                sysStatus: 2001,
                data: {},
                info: "登录失败"
              });
              ctx.body = responseBody;
              resolve();
            }
          });
      } else {
        Object.assign(responseBody, {
          apiStatus: 0,
          sysStatus: 0,
          data: {},
          info: "信息不完整"
        });
        ctx.body = responseBody;
        resolve();
      }
    });
  }

  static async userInfo(ctx, next) {
    // do something

    // 假设这是请求回来的数据
    let data = {
      name: "jk",
      age: 25
    };
    ctx.body = {
      status: true,
      data
    };
  }
}

module.exports = UserController;
