//// [privateNameMethodInStaticFieldInit.ts]
import _class_private_method_get from "@swc/helpers/src/_class_private_method_get.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
var _ref, _method = new WeakSet();
class C {
    constructor(){
        _class_private_method_init(this, _method);
    }
}
C.s = _class_private_method_get(_ref = new C(), _method, function() {
    return 42;
}).call(_ref), console.log(C.s);