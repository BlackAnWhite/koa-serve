const koa = require("koa");
const Router = require('koa-router');
const views = require('koa-views');
const bodyParser = require('koa-bodyparser')
const static = require('koa-static');

const app = new koa();
const router = new Router();

app.use(async (ctx, next) => {
  //  console.log('我是一个中间件');
  await next()
  if (ctx.status === 404) {
    ctx.status = 404;
    ctx.body = '404 not found'
  }
});
//配置静态资源中间件
app.use(static(__dirname + "static"));
// 模板的后缀名是.html
// app.use(views('views', {
//     map: {html: 'ejs'}
// }));
// 模板的后缀名是.ejs
app.use(views('views', {
  extension: 'ejs'
}));
app.use(bodyParser());

app.use(async (ctx, next) => {
  ctx.state.commonData = '共有数据，每个页面都能引用'
  await next()
})
router.get('/', async (ctx) => {
  let title = 'hello world'
  let list = ['aaa', 'bbb', 'ccc']
  await ctx.render('index', {
    title,
    list
  })
})

router.get('/add', async (ctx) => {
  let data = ctx.request.body;
  ctx.body = data;
})

router.get('/news', async (ctx) => {
  await ctx.render('news', {})
})
// router.get('/', async (ctx,next) => {
//   console.log("控制台打印");
//   // 当前路由匹配完成以后继续向下匹配
//   await next()
// });
// router.get('/', async (ctx) => {
//   ctx.body = '首页';
// });
// router.get('/news', async (ctx) => {
//   //从ctx中读取get传值
//   console.log(ctx.url); // /news?id=1&title=aaa
//   console.log(ctx.query); // { id: '1', title: 'aaa' } 获取的是对象   用的最多的方式      ******推荐
//   console.log(ctx.querystring); // id=1&title=aaa      获取的是一个字符串
//   //ctx里面的request里面获取get传值
//   console.log(ctx.request.url); // /news?id=1&title=aaa
//   console.log(ctx.request.query); // { id: '1', title: 'aaa' } 对象
//   console.log(ctx.request.querystring); // id=1&title=aaa
//   ctx.body = '新闻页面';
// });
//动态路由
router.get('/artical/:id', async (ctx) => {
  console.log(ctx.url);
  console.log(ctx.params);
  ctx.body = ctx.params.id
})


//启动路由
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);