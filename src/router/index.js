var express = require('express');
var router = express.Router();
var http = require('http');
var cheerio = require('cheerio');
// get home page
router.get('/',function(req,res,next){
    res.render('index',{title:'简单的nodejs爬虫'});
});
router.get('/getPicture',function(req,res,next){// 浏览器发来get请求
    var page = req.query.page;// 获取get请求中的参数page
    var Res = res;// 保持，防止下边的修改
    // url 获取信息的页面部分地址
    var url ='http://m.lazydiving.com/report?q=nudibranch&page=';
    http.get(url+page,function(res){// 通过get方法获取对应地址中的页面信息
        var chunks = [];
        var size = 0;
        res.on('data',function(chunk){// 监听事件传输
            chunks.push(chunk);
            size+=chunk.length;
        });
        res.on('end',function(){// 数据传输完
            var data = Buffer.concat(chunks,size);
            var html = data.toString();
            var $ = cheerio.load(html);//cheerio模块开始处理dom
            var nudibranchs = [];
            $('#reports-grid>.mv1').each(function(){// 对海兔信息进行处理
                var nudibranch = {};
                nudibranch.enName = $(this).find('h3>.truncate.i').html();
                nudibranch.cnName = $(this).find('h3>.truncate.f6').html().split('(')[0];
                if($(this).find('img').attr('src').indexOf('http://dive.u.qiniudn.com/uploadfile')!=-1){
                    nudibranch.imgUrl = $(this).find('img').attr('src').replace('http://dive.u.qiniudn.com/uploadfile','http://img.lazydiving.com/thumb');
                }else{
                    nudibranch.imgUrl = $(this).find('img').attr('src');
                }
                nudibranchs.push(nudibranch);
            });
            Res.json({
                nudibranchs:nudibranchs
            });
        });
    });
});

module.exports = router;