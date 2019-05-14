const Koa = require("koa");
const Router = require("koa-router");
const glob = require("glob");
const koaWebpack = require("koa-webpack");
const koaStatic = require("koa-static");
const history = require("koa2-history-api-fallback");
const bodyParser = require("koa-bodyparser");

const { PORT } = require("./config/server");
const { getRouterPath, log } = require("./utils/framework");
const webpackConfig = require("./vue/webpack.config.js");

const app = new Koa();
const router = new Router();
const mysql = require("./config/mysql");
const apiRouter = require("./server/router");

process.env.NODE_ENV = "development";

registerApp();

async function registerApp() {
  app.use(async (ctx, next) => {
    log.info(ctx.url);
    await next();
  });

  try {
    // node 端中间件和路由
    await registerMiddlewares();
    // 连接mysql
    await registerSqlConnected();
    // 注册路由
    await registerRoutes();
    app.use(bodyParser());
    app.use(router.routes()); // 添加路由中间件
    app.use(apiRouter.routes()); // 添加api路由
    app.use(router.allowedMethods()); // 对请求进行一些限制处理

    // 前端(vue)路由
    // 所有 navigate 请求重定向到 '/'，因为 webpack-dev-server 只服务这个路由
    app.use(
      history({
        htmlAcceptHeaders: ["text/html"],
        index: "/",
        verbose: true
      })
    );
    app.use(koaStatic("public"));
    await registerWebpack();

    app.listen(PORT);

    log.info(
      "开发环境服务器启动于端口号",
      PORT,
      "等待 webpack 编译中，请稍候。\n\n"
    );
  } catch (e) {
    log.error(e);
    log.error("开发环境服务器启动失败\n\n");
  }
}
/**
 * 注册路由
 */
async function registerRoutes() {
  return new Promise((resolve, reject) => {
    glob("actions/**/*.js", (err, files) => {
      if (err) {
        log.error("读取 actions 失败");
        log.error(err);
        reject();
        return;
      }
      files.forEach(actionPath => {
        let action = require(`./${actionPath}`);
        log.info(actionPath);
        if (typeof action.handler !== "function") {
          log.warn(actionPath, "不是一个合法的 action，已经跳过");
          return;
        }
        if (!action.routerPath) {
          action.routerPath = getRouterPath(actionPath);
        }
        router.get(action.routerPath, action.handler);
      });

      resolve();
    });
  });
}
/**
 * 注册中间件
 */
async function registerMiddlewares() {
  return new Promise((resolve, reject) => {
    glob("middlewares/**/*.js", (err, files) => {
      if (err) {
        log.error("读取 middlewares 失败");
        log.error(err);
        reject();
        return;
      }

      files.forEach(middlewarePath => {
        let middleware = require(`./${middlewarePath}`);
        if (typeof middleware !== "function") {
          return;
        }

        router.use(middleware);
      });

      resolve();
    });
  });
}
/**
 * 注册数据库连接
 */
async function registerSqlConnected() {
  return new Promise((resolve, reject) => {
    // mysql.knex
    //   .column("phone_number")
    //   .select()
    //   .from("users")
    //   .then(res => {
    //     console.log(res);
    //   });
    resolve();
  });
}
/**
 * 注册webpack
 */
async function registerWebpack() {
  return new Promise(resolve => {
    koaWebpack({
      config: webpackConfig,
      devMiddleware: {
        stats: "minimal" // Only output when errors or new compilation happen
      }
    }).then(middleware => {
      app.use(middleware);
      resolve();
    });
  });
}
