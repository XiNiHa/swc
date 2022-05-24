import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @Filename: module.ts
var X;
(function(X1) {
    var Y1;
    (function(Y) {
        var Point1;
        (function(Point) {
            var Origin = Point.Origin = new Point1(0, 0);
        })(Point1 = Y.Point || (Y.Point = {}));
    })(Y1 = X1.Y || (X1.Y = {}));
})(X || (X = {}));
(function(X2) {
    var Y2;
    (function(Y) {
        var Point = function Point(x, y) {
            "use strict";
            _class_call_check(this, Point);
            this.x = x;
            this.y = y;
        };
        Y.Point = Point;
    })(Y2 = X2.Y || (X2.Y = {}));
})(X || (X = {}));
(function(A1) {
    var Instance = A1.Instance = new A();
})(A || (A = {}));
// duplicate identifier
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
