import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// satisfaction of a constraint to Function, no errors expected
function foo(x) {
    return x;
}
var i;
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var a;
var b;
var c;
var r1 = foo(function(x) {
    return x;
});
var r2 = foo(function(x) {
    return x;
});
var r3 = foo(function(x) {
    return x;
});
var r4 = foo(function(x) {
    return x;
});
var r5 = foo(i);
var r8 = foo(c);
var i2;
var C2 = function C2() {
    "use strict";
    _class_call_check(this, C2);
};
var a2;
var b2;
var c2;
var r9 = foo(function(x) {
    return x;
});
var r10 = foo(function(x) {
    return x;
});
var r12 = foo(i2);
var r15 = foo(c2);
