# grunt-iAuto-upload

> upload file

## 如何使用

```shell
npm install grunt-iAuto-upload --save-dev
```

在`Gruntfile.js` 添加

```js
grunt.loadNpmTasks('grunt-iAuto-upload');
```


## `grunt-iAuto-upload` task

```js
grunt.initConfig({
  md5_plus: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

  iAuto: {
    password: '',
    user_name: '',
    addDir:[{ // 目前只只支持新建一个目录
        name: '', //要新建的文件夹的名字
        path: ''// 在什么目录下新建文件夹 
    }],
    uploadFile:[{ // 目前只只支持上传一次文件
        uploadFilePath: '', // 上传的文件路径
        uploadPath: '' // 上传到什么目录下
    }]
  }



### todo
1. 添加异常的判断,多个目录
2. 添加单元测试

