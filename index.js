var https = require("https");
const Koa = require('koa');
const axios = require('axios');
const app = new Koa();
var util = require("./util");
var db = require('./mysql.js');

const agent = new https.Agent({
    rejectUnauthorized: false
  })
const instance = axios.create({ httpsAgent: agent });

app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
    // await next();
  });
  
  app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    await next();
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
            ctx.body = userInfo[0];
        }).catch((err)=>{
            ctx.body = err;
        })
    } else if (ctx.path === "/edit"&& ctx.method==="POST") {
        ctx.body ='edit user page';
    } else if (ctx.path === "/register"&& ctx.method==="POST") {
        // console.log(ctx);
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
  
app.listen(3001, function(){
    console.log("server starts at localhost:3001");
    db.startServer();
});