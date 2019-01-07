/**
 * @export
 * @param {WebGLRenderingContext} gl
 * @param {WebGLProgram} program
 * @param {Object} data
 */
export default function(gl, program, data) {
    var type = '';
    var value = null;
    var index = 0;
    var len = 0;
    for (var attr in data) {
        type = data[attr].type;
        value = data[attr].value;
        if (!Array.isArray(value)) {
            continue;
        }

        len = value.length;
        index = gl.getUniformLocation(program, attr);
        if (type === 'int') {
            gl['uniform' + len + 'iv'](index, value);
            continue;
        }

        if (type === 'float') {
            gl['uniform' + len + 'fv'](index, value);
            continue;
		}
    }
}
