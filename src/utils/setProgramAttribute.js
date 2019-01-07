/**
 *
 *
 * @export
 * @param {WebGLRenderingContext} gl
 * @param {WebGLProgram} program
 * @param {Object} data -
 *   data={index:{type:[]}}
 */
export default function(gl, program, data) {
    var type = '';
    var value = null;
    var index = 0;
    var len = 0;
    for (var attr in data) {
        type = data[attr].type;
        value = data[attr].value;
        index = gl.getAttribLocation(program, attr);

        if (type === 'pointer') {
            gl.enableVertexAttribArray(index);
            gl.vertexAttribPointer(
                index,
                value[0],
                value[1],
                value[2],
                value[3],
                value[4]
            );
            continue;
		}
		
        if (type === 'float' && Array.isArray(value)) {
            len = value.length;
            if (len <= 0) {
                continue;
            }
            len > 4 && (len = 4);
            gl['vertexAttrib' + len + 'fv'](index, value);
            continue;
        }
    }
}
