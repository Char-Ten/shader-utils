import _setProgramAttribute from './utils/setProgramAttribute';
import _setProgramUniform from './utils/setProgramUniform';
export const setProgramAttribute = _setProgramAttribute;
export const setProgramUniform = _setProgramUniform;

/**
 * @todo 创建着色器程序
 * @param {WebGLRenderingContext} gl
 * @param {String} vertexSource
 * @param {String} fragmentSource
 */
export function createProgram(gl, vertexSource, fragmentSource) {
    const program = gl.createProgram();
    createShader(gl, program, vertexSource, gl.VERTEX_SHADER);
    createShader(gl, program, fragmentSource, gl.FRAGMENT_SHADER);
    gl.linkProgram(program);
    return program;
}

/**
 * @todo 创建着色器
 * @param {WebGLRenderingContext} gl
 * @param {WebGLProgram} program
 * @param {String} source
 * @param {Number} type
 */
export function createShader(gl, program, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
	gl.attachShader(program, shader);
    return shader;
}

/**
 * @todo 创建缓冲数据
 * @param {WebGLRenderingContext} gl
 * @param {*} data
 * @param {*} usage
 * @returns {WebGLBuffer}
 */
export function createArrayBuffer(gl, data, usage) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, data, usage || gl.STATIC_DRAW);
    return buffer;
}

/**
 * @todo 创建纹理贴图
 * @param {WebGLRenderingContext} gl - 使用webgl的上下文
 * @param {Canvas||Image} image - 要作为纹理的图片对象
 * @return {WebglTexture} texture对象
 */
export function createTextureByImage(gl, image) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    return checkTexture(gl, texture, image.width, image.height);
}

/**
 * @todo 更新纹理贴图
 * @param {WebGLRenderingContext} gl - 使用webgl的上下文
 * @param {Number} index - 纹理索引 gl.TEXTURE0
 * @param {WebglTexture} texture - 要更新的纹理
 * @param {Canvas||Image} image - 要作为纹理的图片对象
 * @return {WebglTexture} texture对象
 */
export function updateTexture(gl, index, texture, image) {
    gl.activeTexture(index);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    return checkTexture(gl, texture, image.width, image.height);
}

/**
 * @todo 检查纹理贴图
 * @param {WebGLRenderingContext} gl - 使用webgl的上下文
 * @param {WebGLTexture} texture - 纹理对象
 * @param {Number} width - 宽度
 * @param {Number} height - 高度
 * @return {WebglTexture} texture对象
 */
export function checkTexture(gl, texture, width, height) {
    if (isPowerOf2(width) && isPowerOf2(height)) {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        return texture;
    }
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return texture;
}

/**
 * @todo 检查数字是否为2的指数
 * @param {Number} value - 要检查的值
 * @return {Boolean}
 */
export function isPowerOf2(value) {
    return !(value & (value - 1));
}
