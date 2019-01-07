# webgl-dev-utils

> utils function for native webgl development

> Waiting to translate to English. Or see [中文版](./README_zh.md).

### Usage

install

```shell
npm i webgl-dev-utils -S
```

import

```javascript
import * as webglUtils from 'webgl-dev-utils';
```

### Example

```javascript
import * as webglUtils from 'webgl-dev-utils';
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

//create program
const program = webglUtils.createProgram(
    gl,
    vertexShaderCode,
    fragmentShaderCode
);

//create points
const points = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]);

//create buffer
const buffer = webglUtils.createArrayBuffer(gl, points);

//set canvas size
const width = 400;
const height = 300;

//set color.(max:1,min:0)
const color = [1, 0, 0, 1];

canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);

//use program
gl.useProgram(program);

//Sets the attribute's value to the specified value
webglUtils.setProgramAttribute(gl, program, {
    a_position: {
        type: 'pointer',
        value: [2, gl.FLOAT, false, 0, 0]
    }
});

//Sets the uniform's value to the specified value
webglUtils.setProgramUniform(gl, program, {
    u_color: {
        type: 'float',
        value: color
    }
});

//render
gl.viewport(0, 0, width, height);
gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
```

---

### API

#### `.createProgram(gl, vertexSource, fragmentSource)`

| Param          |         Type          | Desc                             |
| :------------- | :-------------------: | :------------------------------- |
| gl             | WebGLRenderingContext | -                                |
| vertexSource   |        String         | Vertex shader source   |
| fragmentSource |        String         | Fragment shader source |

return `{WebGLProgram}`

#### `.createShader(gl, program, source, type)`

| Param   |         Type          | Desc          |
| :------ | :-------------------: | :------------ |
| gl      | WebGLRenderingContext | -             |
| program |     WebGLProgram      | -             |
| source  |        String         | Shader source   |
| type    |        Number         | Shader type |

return `{WebShader}`

#### `.createArrayBuffer(gl, data, usage)`

#### `.createTextureByImage(gl, image)`

#### `.updateTexture(gl, image)`

#### `.checkTexture(gl,texture,width,height)`

#### `.isPowerOf2(value)`

#### `.setProgramAttribute(gl, program, data)`

#### `.setProgramUniform(gl, program, data)`
> NOTE: This method does not currently support matrices.
