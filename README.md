# grunt-iauto-upload

> upload file

## 如何使用

```shell
npm install grunt-iauto-upload --save-dev
```

在`Gruntfile.js` 添加

```js
grunt.loadNpmTasks('grunt-iauto-upload');
```


## `grunt-iauto-upload` task

```js
grunt.initConfig({
  iauto_upload: {
	options: {
	  options: pkg.iauto
	}
  },
});
```

### Options

	iauto: {
		password: '',
		user_name: '',
		addDir:[{ // 支持创建多个目录
			name: '', //要新建的文件夹的名字
			path: ''// 在什么目录下新建文件夹 
		}],
		uploadFile:[{ // 支持上传多个文件
			uploadFilePath: '', // 上传的文件路径
			uploadPath: '' // 上传到什么目录下
		}]
	}



### Todo
1. ~~添加异常的判断,多个目录~~
2. 添加单元测试

