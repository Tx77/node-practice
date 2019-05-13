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
    await registerRoutes();
    app.use(bodyParser());
    app.use(router.routes()); // 添加路由中间件
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
        log.info(actionPath);
        let action = require(`./${actionPath}`);
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

async function registerSqlConnected() {
  return new Promise((resolve, reject) => {
    mysql.mysql
      .column("name")
      .select()
      .from("users")
      .then(res => {
        console.log(res);
      });
    resolve();
  });
}

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
