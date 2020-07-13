//引入 koa模块
const Koa = require('koa');
const Router = require('koa-router');
const views = require('koa-views');
const static = require('koa-static');

//实例化
const app = new Koa();
const router = new Router();

//配置静态资源中间件
app.use(static(__dirname + "/static"));
//配置模板引擎中间件
app.use(views('views', {
  // extension: 'ejs'
  map:{html:'ejs'}
}));

router.get('/', async (ctx) => {
  // 设置 cookie
  ctx.cookies.set('userinfo', encodeURIComponent('张三'), {
    maxAge: 24 * 60 * 60 * 1000
  })
  await ctx.render('index', {});
});
router.get('/news', async (ctx) => {
  // 获取 cookie
  console.log(decodeURIComponent(ctx.cookies.get('userinfo')));
  await ctx.render('index', {});
});

//启动路由
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);