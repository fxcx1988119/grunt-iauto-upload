//@charset "utf-8";

var fs = require('fs');
var querystring = require("querystring");
var path = require('path');
var http = require("http");

/**
 * [Deploy description]
 */
function Deploy( options ){
    console.log("简单的智能自动上传，前端自动化才是王道");
    this.password = options.password;
    this.user_name = options.user_name;
    //console.log('init');
}

/**
 * 在资源服务器新建目录
 * @param {Object}   options  发送请求需要的参数
 * @param {String}   options.name  新建目录的名字
 * @param {String}   options.path  在什么路径下新建目录下目录的名字
 * @param {String}   options.Cookie  登录成功后返回的Cookie
 * @param {Function} callback 新建目录成功后的回调函数
 */
Deploy.prototype.addDir = function( options, callback ){
    var self = this;
    this.autoLogin( function(){
        options['Cookie'] = arguments[0]
        self.addDirHandle(options, callback );
    });
}

Deploy.prototype.addDirHandle = function( options, callback ){
    var boundary = "---------------------------leon";
    var formStr =   '--' + boundary + '\r\n' +
                    'Content-Disposition: form-data; name="name"' + '\r\n\r\n' + options['name'] + '\r\n' + '--' + boundary + '\r\n' +
                    'Content-Disposition: form-data; name="path"' + '\r\n\r\n' + options['path'] + '\r\n' + '--' + boundary + '\r\n';

    var formEnd = '\r\n--' + boundary + '--\r\n';
    var defaults = {
        host: "admin.thsi.cn",
        port: 80,
        method: "POST",
        path: "/index.php?controller=file&action=diradd",
        headers: {
            "Content-Type": "multipart/form-data; boundary=" + boundary,
            "Content-Length": formStr.length + formEnd.length,
            "Cookie": options['Cookie']
        }
    };
    var req = http.request(defaults, function(res) {
        res.on("data", function(data) {
           console.log("创建" + options['name'] + '目录成功.');
           typeof callback == "function" && callback.call(null, data);
        });
        res.on("end", function(){
        });
    });
    req.write(formStr, 'utf8');
    req.write(formEnd, 'utf8');
    req.end();
}


Deploy.prototype.autoLogin = function( callback ){
    var self = this;
    var contents = querystring.stringify({
        password: self.password,
        user_name: self.user_name,
        controller: "login",
        action: "in"
    });

    var options = {
        host: "admin.thsi.cn",
        path: "/",
        method: "post",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Content-Length": contents.length,
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "zh-cn",
            "Cache-Control": "no-cache",
            "Connection": "Keep-Alive",
            "Host": "admin.thsi.cn",
            "Referer": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.101 Safari/537.36"
        }
    };

    var req = http.request(options, function(res) {
        res.setEncoding("utf8");
        var headers = res.headers;
        var cookies = headers["set-cookie"][0];// 返回是一个对象
        if( cookies.indexOf('PHPSESSID=') >= 0 ){
            console.log("登录成功." + cookies );
            typeof callback == "function" && callback.call(this, cookies);
        } else {
            console.log("登录失败，请检查账号，密码是否正确");
        }
        res.on('end', function(){
            console.log('autoLoginEnd');
        });
    }).on('error', function(){
        console.log('login error');
    });

    req.write(contents);
    req.end();
}


Deploy.prototype.uploadFile = function(options, callback){
    var self = this;

    this.autoLogin( function(){
        options['Cookie'] = arguments[0];
        self.uploadFileHandle(options, callback);
    });
}

Deploy.prototype.uploadFileHandle = function( options, callback ){
    var boundary = "---------------------------leon";
    var uploadFilePath = options['uploadFilePath'];
    var datas = fs.readFileSync(uploadFilePath);
    var uploadPath = options['uploadPath'];

    var formStr = '--' + boundary + '\r\n' + 'Content-Disposition: form-data; name="zipFlag"' + '\r\n\r\n' + 'true' + '\r\n' + '--' + boundary + '\r\n' + 'Content-Disposition: form-data; name="path"' + '\r\n\r\n' + uploadPath + '\r\n' + '--' + boundary + '\r\n' + 'Content-Disposition: form-data; name="file"; filename="' + uploadFilePath + '"' + '\r\n' + 'Content-Type: application/octet-stream' + '\r\n\r\n';

    var formEnd = '\r\n--' + boundary + '--\r\n';
    var opts = {
        host: "admin.thsi.cn",
        port: 80,
        method: "POST",
        path: "/index.php?controller=file&action=upload",
        headers: {
            "Content-Type": "multipart/form-data; boundary=" + boundary,
            "Content-Length": formStr.length + datas.length + formEnd.length,
            "Cookie": options['Cookie']
        }
    };

    console.log("正在上传，请等候...");
    var req = http.request(opts, function(res) {
        res.on("data", function(data) {
           var sData =  data.toString() ;
           if( sData.indexOf('temporarily unavailable') > 0 ){
                console.log('如果上传的zip文件含多个文件夹，服务器返回会超时，其实文件时上传成功了。亲，你可以发布到测试环境去看看哦。\n');
                console.log("去 " + uploadPath + ' 看看是不是 ' + uploadFilePath + '上传这里了');
           }
           if( sData.indexOf('true') > 0 ){
                console.log('上传 '+ uploadFilePath +'文件成功到资源服务器 ' + uploadPath + '\n' );
                console.log('如果有任何疑问请联系 yangkongqing#myhexin.com')
           } else {
                console.log('上传 '+ uploadFilePath +'文件失败');
           }
           callback();
        });
        res.on("end", function(){
            callback();
        });
    });

    req.write(formStr, 'utf8');
    req.write(datas);
    req.write(formEnd, 'utf8');
    req.end();
}


module.exports = Deploy;
