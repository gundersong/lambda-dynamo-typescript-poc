var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { LambdaLog } from 'lambda-log';
const keyMap = [
    ['msg', 'message'],
    ['_logLevel', 'log_level'],
];
const renameProp = (oldKey, newKey, _a) => {
    var _b = oldKey, old = _a[_b], others = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
    return (Object.assign({ [newKey]: old }, others));
};
const addTimeStamp = (value) => {
    const timestamp = +Date.now();
    value.timestamp = timestamp;
};
const keyReplacer = (key, value) => {
    if (key === '') {
        // Replace log object keys
        addTimeStamp(value);
        return keyMap.reduce((acc, [oldKey, newKey]) => renameProp(oldKey, newKey, acc), value);
    }
    return value;
};
export const logger = new LambdaLog({
    replacer: keyReplacer,
    tags: [`${process.env.API_ENTITY}_service`],
});
//# sourceMappingURL=logger.js.map