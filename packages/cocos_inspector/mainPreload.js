const _0x4494 = [
    'readFileSy',
    'join',
    'readConfig',
    'onfig.json',
    '440990kNryIE',
    'Qhrnk',
    '8DyEGiv',
    '410217DjsTVk',
    '929597auGJIE',
    '1SbfQGa',
    'utf-8',
    'writeFileS',
    '37029kOTYsw',
    'parse',
    'existsSync',
    '81437GlqHyk',
    '3YhzTfx',
    'ync',
    '../cocos-i',
    'stringify',
    '358088hQeZHv',
    'nspector-c',
    '1SviHWv',
    '1333529vCfXqd',
    'path',
    'config.jso',
    'dtnKU',
    'saveConfig'
];
function _0x11e2(_0x45f5fe, _0x2dfa52) {
    _0x45f5fe = _0x45f5fe - (-0x737 * -0x3 + -0x985 * 0x1 + 0x19 * -0x69);
    let _0x2d515d = _0x4494[_0x45f5fe];
    return _0x2d515d;
}
const _0x33a736 = _0x11e2;
(function (_0x3833ea, _0x57e765) {
    const _0x185502 = _0x11e2;
    while (!![]) {
        try {
            const _0x42ecb8 = parseInt(_0x185502(0x1e5)) * parseInt(_0x185502(0x1df)) + parseInt(_0x185502(0x1ea)) * -parseInt(_0x185502(0x1ec)) + parseInt(_0x185502(0x1f8)) * -parseInt(_0x185502(0x1e2)) + parseInt(_0x185502(0x1ed)) + parseInt(_0x185502(0x1f6)) + parseInt(_0x185502(0x1fa)) + -parseInt(_0x185502(0x1e6)) * parseInt(_0x185502(0x1f9));
            if (_0x42ecb8 === _0x57e765)
                break;
            else
                _0x3833ea['push'](_0x3833ea['shift']());
        } catch (_0x5203a2) {
            _0x3833ea['push'](_0x3833ea['shift']());
        }
    }
}(_0x4494, 0x120fb5 + -0x14 * -0xd7fb + -0x1 * 0x15316b));
let fs = require('fs'), path = require(_0x33a736(0x1ee)), _configPath = path[_0x33a736(0x1f3)](__dirname, _0x33a736(0x1ef) + 'n'), __parentConfig = path[_0x33a736(0x1f3)](__dirname, _0x33a736(0x1e8) + _0x33a736(0x1eb) + _0x33a736(0x1f5));
global[_0x33a736(0x1f4)] = () => {
    const _0x165f8e = _0x33a736, _0x33ce79 = { 'dtnKU': _0x165f8e(0x1e0) };
    let _0x14040f = '';
    return fs[_0x165f8e(0x1e4)](__parentConfig) ? _0x14040f = fs[_0x165f8e(0x1f2) + 'nc'](__parentConfig, { 'encoding': _0x33ce79[_0x165f8e(0x1f0)] }) : _0x14040f = fs[_0x165f8e(0x1f2) + 'nc'](_configPath, { 'encoding': _0x33ce79[_0x165f8e(0x1f0)] }), JSON[_0x165f8e(0x1e3)](_0x14040f);
}, global[_0x33a736(0x1f1)] = _0x58e1c3 => {
    const _0x3406e3 = _0x33a736, _0x21a185 = { 'Qhrnk': _0x3406e3(0x1e0) };
    let _0x35c167 = JSON[_0x3406e3(0x1e9)](_0x58e1c3);
    fs[_0x3406e3(0x1e1) + _0x3406e3(0x1e7)](__parentConfig, _0x35c167, { 'encoding': _0x21a185[_0x3406e3(0x1f7)] });
};