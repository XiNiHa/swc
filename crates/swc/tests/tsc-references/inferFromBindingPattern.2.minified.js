//// [inferFromBindingPattern.ts]
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
f1(), _sliced_to_array(f2(), 1)[0], f3().x, _sliced_to_array([
    42
], 1)[0], _sliced_to_array(selectJohn(), 1)[0];
var ref = _sliced_to_array(selectJohn(), 2);
ref[0], ref[1];
var john = selectJohn(), _john = _sliced_to_array(john, 2);
_john[0], _john[1], makeTuple(stringy());
var ref1 = _sliced_to_array(makeTuple(stringy()), 1);
ref1[0];