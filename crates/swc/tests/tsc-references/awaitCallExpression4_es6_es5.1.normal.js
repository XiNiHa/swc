// @target: ES6
// @noEmitHelpers: true
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function func() {
    return _func.apply(this, arguments);
}
function _func() {
    _func = _async_to_generator(function() {
        var b;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    before();
                    return [
                        4,
                        pfn
                    ];
                case 1:
                    b = _state.sent()(a, a, a);
                    after();
                    return [
                        2
                    ];
            }
        });
    });
    return _func.apply(this, arguments);
}
