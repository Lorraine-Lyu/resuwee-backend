var http = require("http");
const Koa = require('koa');
const app = new Koa();
var util = require("./util");
var db = require('./mysql.js');

app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
  });
  
app.use(async ctx => {
    if (ctx.url === "/") {
        ctx.body = "hello world";
    }
    else if (ctx.path ==="/login" && ctx.method==="GET") {
        // var res = "response: ";
        await db.login(ctx.query)
        .then((userInfo)=>{
            console.log(userInfo);
            // res += JSON.toString(userInfo[0]);
            ctx.body = JSON.toString(userInfo[0]);
        }).catch((err)=>{
            ctx.body = err;
        })
    } else if (ctx.path === "/edit"&& ctx.method==="POST") {
        ctx.body ='edit user page';
    } else if (ctx.path === "/register"&& ctx.method==="POST") {
        // ctx.body = 'register new user profile';
        db.register(ctx.query)
        .then((msg)=> {
            console.log(msg);
            ctx.body = msg;
        }).catch((err)=> {
            ctx.body = err;
        });
    }
});

app.on('error', err => {
    log.error('server error', err)
});
  
app.listen(3000, function(){
    console.log("server starts at localhost:3000");
    db.startServer();
});