//// [emptyArrayBindingPatternParameter01.ts]
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
function f(param) {
    var _param = _sliced_to_array(param, 0);
    var x, y, z;
}