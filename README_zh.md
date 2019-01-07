# webgl-dev-utils

> 简化原生 webgl 开发的 js 工具类

### 开始

安装:

```shell
npm i webgl-dev-utils -S
```

引入

```javascript
import * as webglUtils from 'webgl-dev-utils';
```

### 例子

```javascript
//快速创建一个webgl开发环境
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl');
const vertexShaderCode = `
precision mediump float;
attribute vec2 a_position;
void main(){
	gl_Position =vec4(a_position,0.0,1.0);
}
`;
const fragmentShaderCode = `
precision mediump float;
uniform vec4 u_color;
void main(){
	gl_FragColor = u_color;
}
`;

//创建着色器程序
const program = webglUtils.createProgram(
    gl,
    vertexShaderCode,
    fragmentShaderCode
);

//创建顶点
const points = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]);

//创建数组缓冲区
const buffer = webglUtils.createArrayBuffer(gl, points);

//设置画布大小
const width = 400;
const height = 300;

//设置颜色[r,g,b,a]，最大值为1，最小值为0
const color = [1, 0, 0, 1];

canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);

//使用程序
gl.useProgram(program);

//往顶点着色器传attribute变量
webglUtils.setProgramAttribute(gl, program, {
    a_position: {
        type: 'pointer',
        value: [2, gl.FLOAT, false, 0, 0]
    }
});

//往着色器里面传uniform变量
webglUtils.setProgramUniform(gl, program, {
    u_color: {
        type: 'float',
        value: color
    }
});

//设置视口
gl.viewport(0, 0, width, height);

//绘制
gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
```
---
### API

#### `.createProgram(gl, vertexSource, fragmentSource)`

| 参数           |         类型          | 说明             |
| :------------- | :-------------------: | :--------------- |
| gl             | WebGLRenderingContext | webgl 渲染上下文 |
| vertexSource   |        String         | 顶点着色器源码   |
| fragmentSource |        String         | 片元着色器源码   |

创建着色器程序，返回 webGL 着色器程序对象`{WebGLProgram}`

#### `.createShader(gl, program, source, type)`

| 参数    |         类型          | 说明                 |
| :------ | :-------------------: | :------------------- |
| gl      | WebGLRenderingContext | webgl 渲染上下文     |
| program |     WebGLProgram      | webgl 着色器程序对象 |
| source  |        String         | 着色器源码           |
| type    |        Number         | 着色器类型           |

创建着色器对象，返回 webGL 着色器程序对象`{WebShader}`

#### `.createArrayBuffer(gl, data, usage)`

| 参数  |         类型          | 说明                                       |
| :---- | :-------------------: | :----------------------------------------- |
| gl    | WebGLRenderingContext | webgl 渲染上下文                           |
| data  |      ArrayBuffer      | 数组数据，可以为普通数组，也可以为类型数组 |
| usage |        Number         | buffer 用途，默认为 gl.STATIC_DRAW         |

创建类型数组缓冲区，返回 webGL 缓冲区对象`{WebGLBuffer}`

#### `.createTextureByImage(gl, image)`

| 参数  |         类型          | 说明             |
| :---- | :-------------------: | :--------------- |
| gl    | WebGLRenderingContext | webgl 渲染上下文 |
| image |         image         | 图片对象         |

根据图片创建纹理贴图，返回 webGL 纹理对象`{WebGLTexture}`

#### `.updateTexture(gl, image)`

| 参数  |         类型          | 说明             |
| :---- | :-------------------: | :--------------- |
| gl    | WebGLRenderingContext | webgl 渲染上下文 |
| image |         image         | 图片对象         |

根据图片更新纹理贴图，返回 webGL 纹理对象`{WebGLTexture}`

#### `.checkTexture(gl,texture,width,height)`

| 参数    |         类型          | 说明             |
| :------ | :-------------------: | :--------------- |
| gl      | WebGLRenderingContext | webgl 渲染上下文 |
| texture |     WebGLTexture      | 纹理对象         |
| width   |        Number         | 纹理宽度         |
| height  |        Number         | 纹理高度         |

检查纹理的长度和宽度是否为 2 的 n 次幂，如果不是的话，对纹理进行拉伸处理。

> 详情查阅 [npot 问题](https://stackoverflow.com/questions/3792027/webgl-and-the-power-of-two-image-size)

返回 `{WebGLTexture}` 对象

#### `.isPowerOf2(value)`

| 参数  |  类型  | 说明       |
| :---- | :----: | :--------- |
| value | Number | 要校验的值 |

校验给定的数字是否为 2 的指数，返回`{Boolean}`

#### `.setProgramAttribute(gl, program, data)`

| 参数    |         类型          | 说明                 |
| :------ | :-------------------: | :------------------- |
| gl      | WebGLRenderingContext | webgl 渲染上下文     |
| program |     WebGLProgram      | webgl 着色器程序对象 |
| data    |        Object         | 要赋值的数据         |

向 webgl 着色器程序传递 attribute 的值，其中，data 的传值格式如下:

```javascript
{
	[index]:{
		type,
		value
	}
}
```

-   `index`为 webgl 着色器程序的 attribute 变量名。
-   `type`为要传递的类型，枚举，可选的值有：
    -   `float`：传递 float 类型的值
    -   `int`：传递 int 类型的值
    -   `pointer`：调用`gl.vertexAttribPointer`函数，将`value`作为其参数传入
-   `value`为要传递的值，数组类型

示例：
```javascript
webglUtils.setProgramAttribute(gl,program,{
	/**
	 * @desc
	 * 设置buffer读取规则
	 * 将值传递给 webgl 顶点着色器中的`attribut vec2 a_position`变量
	 * value对应的值:[数量,类型,归一化,起始值,偏移值]
	*/
	a_position:{
		type:'pointer',
		value:[2,gl.FLOAT,false,0,0]
	},

	/**
	 * @desc
	 * 将值传递给 webgl 顶点着色器中的`attribut vec3 a_light_pos`变量
	 * value数组长度对应vec类型的长度
	 * 因为vec长度最大是4(vec4)，当value长度超过4，取前4位传入
	 * 
	*/
	a_light_pos:{
		type:'float',
		value:[1,2,3]
	}
})

```

无返回值

#### `.setProgramUniform(gl, program, data)`
| 参数    |         类型          | 说明                 |
| :------ | :-------------------: | :------------------- |
| gl      | WebGLRenderingContext | webgl 渲染上下文     |
| program |     WebGLProgram      | webgl 着色器程序对象 |
| data    |        Object         | 要赋值的数据         |

往着色器程序里传递 uniform 变量值，其中，data 的传值格式如下
-   `index`为 webgl 着色器程序的 attribute 变量名。
-   `type`为要传递的类型，枚举，可选的值有：
    -   `float`：传递 float 类型的值
    -   `int`：传递 int 类型的值
-   `value`为要传递的值，数组类型

> 注意，本方法暂时不支持Matrix类型的数据传递  


无返回值