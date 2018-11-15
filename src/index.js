var path = require('path');
var express = require('express');
var bodyparser = require('body-parser');
var app = express();
var router = require('./router/index');// 路由
app.set('views',path.join(__dirname,"views"))
   .set('view engine','ejs')// 设置模板路径和引擎
   .use(bodyparser.json())
   .use(bodyparser.urlencoded({extended:true}))// bodyparser配置
   .use('/',router)// 路由
   .use('/static', express.static(path.join(__dirname, 'static')))// 静态资源目录设置
   .listen(8080,function(){
     console.log('Application running at localhost:8080');
   });