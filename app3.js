//引入 koa模块
const Koa = require('koa');
const Router = require('koa-router');
const views = require('koa-views');
const static = require('koa-static');
const session = require('koa-session');

//实例化
const app = new Koa();
const router = new Router();

//配置静态资源中间件
app.use(static(__dirname + "/static"));

//配置模板引擎中间件
app.use(views('views', {
  // extension: 'ejs'
  map: {html : 'ejs'}
}));

//配置session的中间件
app.keys = ['some secret hurr']; /**cookie的签名 默认*/
const CONFIG = {
  key: 'koa:sess',
  /** 默认 */
  maxAge: 100000,
  /**  cookie的过期时间 */
  overwrite: true,
  /** 默认 可以重写过期时间 */
  httpOnly: true,
  /**  true表示只有服务器端可以获取 cookie */
  signed: true,
  /** 默认 签名 */
  rolling: true,
  /** 在每次请求时强行设置 cookie，这将重置 cookie 过期时间（默认：false） */
  renew: false,
  /** 当用户进行浏览器操作时刷新 cookie 过期时间 */
};
app.use(session(CONFIG, app));

router.get('/', async (ctx) => {
  // 设置 cookie
  ctx.session.userinfo = '张三';
  await ctx.render('index', {});
});

router.get('/news', async (ctx) => {
  // 获取 cookie
  console.log(ctx.session.userinfo);
  await ctx.render('index', {});
});

//启动路由
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);