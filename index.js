var https = require("https");
const Koa = require('koa');
var bodyParser = require('koa-bodyparser');
const axios = require('axios');
const app = new Koa();
var util = require("./util");
var db = require('./mysql.js');

const agent = new https.Agent({
    rejectUnauthorized: false
  })
const instance = axios.create({ httpsAgent: agent });

app.use(bodyParser());

app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
    // await next();
  });
  
  app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Auth-Token,append,delete,entries,foreach,get,has,keys,set,values,Authorization');
    ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    ctx.set('Connection', 'Keep-Alive');
    ctx.set('Access-Control-Allow-Credentials', 'true');
    await next();
  });

// RewriteEngine On
// RewriteCond %{REQUEST_METHOD} OPTIONS
// RewriteRule ^(.*)$ $1 [R=200,L]

app.use(async ctx => {
    if (ctx.url === "/") {
        ctx.body = "hello world";
    }
    else if (ctx.path ==="/login" && ctx.method==="GET") {
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
        console.log(ctx.request.body);
        await db.register(ctx.request.body)
        .then((msg)=> {
            console.log(msg);
            ctx.body = msg;
        }).catch((err)=> {
            ctx.body = err;
        });
    } else if (ctx.method==="OPTIONS" && ctx.path === "/register") {
        ctx.status = 200;
    }
});

app.on('error', err => {
    log.error('server error', err)
});
  
app.listen(3001, function(){
    console.log("server starts at localhost:3001");
    db.startServer();
});