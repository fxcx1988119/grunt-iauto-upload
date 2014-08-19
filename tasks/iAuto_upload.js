/*
 * grunt-iauto-upload
 * https://github.com/huixisheng/grunt-test
 *
 * Copyright (c) 2014 huixisheng
 * Licensed under the MIT license.
 */

'use strict';

var Deploy = require('../lib/deploy.js');


module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('iauto_upload', 'upload file', function() {
    var done = this.async();
    var options = this.options({
      password: '',
      user_name: '',
      addDir:[{
          name: '', //要新建的文件夹的名字
          path: ''// 在什么目录下新建文件夹 
      }],
      uploadFile:[{
          uploadFilePath: '', // 上传的文件路径
          uploadPath: '' // 上传到什么目录下
      }]
    });
    if(!options['password'] || !options['user_name']){
      grunt.log.error('请配置资源服务器的用户名密码');
      done();
      return false;
    }

    var deploy = new Deploy({
      password: options.password,
      user_name: options.user_name
    });
    var addDir = options.addDir;
    var uploadFile = options.uploadFile;

    /**
     * @todo  添加异常的判断和多个目录
     */
    var addDirLen = addDir.length;
    var uploadFileLen = uploadFile.length;
    for(var i = 0; i < addDirLen; i++){
      (function(i){
        if(i === addDirLen - 1 ){
          deploy.addDir({
            'name': addDir[i]['name'],
            'path': addDir[i]['path']
          }, function(){
              for(var j = 0; j < uploadFileLen; j++){
                (function(j){
                    deploy.uploadFile({
                        uploadFilePath: uploadFile[j]['uploadFilePath'],
                        uploadPath: uploadFile[j]['uploadPath']
                    }, function(){
                      if(j === uploadFileLen - 1 ){
                        done();  
                      } else {
                        console.log("上传" + uploadFile[j]['uploadFilePath'] + '成功');
                      }
                      
                    });
                })(j);
              }
          });
        } else {
          deploy.addDir({
            'name': addDir[i]['name'],
            'path': addDir[i]['path']
          }, function(){
            console.log("创建" + addDir[i]['name'] + '成功');
          });
        }

      })(i);
    }

  });

};
