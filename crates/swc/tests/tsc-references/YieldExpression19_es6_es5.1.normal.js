// @target: es6
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function foo() {
    var bar;
    return _ts_generator(this, function(_state) {
        bar = function bar() {
            function quux() {
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            return [
                                4,
                                foo
                            ];
                        case 1:
                            _state.sent();
                            return [
                                2
                            ];
                    }
                });
            }
        };
        return [
            2
        ];
    });
}
