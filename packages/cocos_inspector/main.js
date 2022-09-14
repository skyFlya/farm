'use strict';
const _0x3881 = [
    'exports',
    '7vvegue',
    'nspector-c',
    'select',
    'tml',
    'electron.h',
    'onfig.json',
    'path',
    '500731KvRypq',
    '../cocos-i',
    'tryShowWin',
    'dVIcZ',
    'utf-8',
    'versions',
    'json',
    'focusAsset',
    'previewPor',
    'process',
    'parse',
    'index.html',
    '264891Wkfjii',
    'ver',
    'd.js',
    'webContent',
    'xvUcI',
    'config.jso',
    '29SGMhUn',
    'viFPv',
    'readFileSy',
    '7135fYCMTP',
    '&mode=',
    ':focusNode',
    'executeJav',
    'wYvbG',
    'aScript',
    'HPudG',
    'focusNode',
    'Cocos\x20Insp',
    'loadURL',
    'ready-to-s',
    '1VIPXma',
    'aWANw',
    'setMenu',
    'NTBvR',
    'show',
    'DaaLB',
    '#2e2c29',
    '29091xjcICV',
    ':focusAsse',
    'PreviewSer',
    '474345tGcvaR',
    'fOUUM',
    'Selection',
    'isteners',
    'bind',
    'xJota',
    './package.',
    'removeAllL',
    'mainPreloa',
    'de(',
    'file://',
    'MIOom',
    'closed',
    'TBuop',
    '25cuOXnX',
    'Ipc',
    'index_low_',
    '6MIeoKD',
    '?port=',
    'join',
    'how',
    'sendToAll',
    'dow',
    'ector',
    'v.switchMo',
    'existsSync',
    'showWindow',
    '110654BlZsTf',
    'dbgNh',
    'Sec',
    '24179kPbeRX',
    'node',
    'Tlwao',
    'error',
    'electron',
    'assets:hin',
    'name',
    'split',
    'asset',
    'disableWeb'
];
const _0x430e8a = _0x3b1a;
(function (_0x2bd056, _0x332bc8) {
    const _0x13cc32 = _0x3b1a;
    while (!![]) {
        try {
            const _0x429fd6 = parseInt(_0x13cc32(0x135)) * -parseInt(_0x13cc32(0xfb)) + -parseInt(_0x13cc32(0x123)) * parseInt(_0x13cc32(0x113)) + parseInt(_0x13cc32(0x12e)) * parseInt(_0x13cc32(0x120)) + -parseInt(_0x13cc32(0x141)) + parseInt(_0x13cc32(0x116)) * -parseInt(_0x13cc32(0xf0)) + parseInt(_0x13cc32(0xed)) * parseInt(_0x13cc32(0x102)) + parseInt(_0x13cc32(0x105));
            if (_0x429fd6 === _0x332bc8)
                break;
            else
                _0x2bd056['push'](_0x2bd056['shift']());
        } catch (_0x42eb08) {
            _0x2bd056['push'](_0x2bd056['shift']());
        }
    }
}(_0x3881, -0x137467 + -0xa3db2 + -0x20e * -0x1380));
const {BrowserWindow, app, remote, ipcMain} = require(_0x430e8a(0x127)), path = require(_0x430e8a(0x134)), pcs = require(_0x430e8a(0x13e)), folder = '', devTools = ![];
let win, mode = 0x8e0 + 0x17 * -0x35 + -0x41d, unloaded = ![];
const PKG_NAME = require(_0x430e8a(0x10b) + _0x430e8a(0x13b))[_0x430e8a(0x129)];
let fs = require('fs'), _configPath = path[_0x430e8a(0x118)](__dirname, _0x430e8a(0xec) + 'n'), __parentConfig = path[_0x430e8a(0x118)](__dirname, _0x430e8a(0x136) + _0x430e8a(0x12f) + _0x430e8a(0x133));
function readConfig() {
    const _0x475952 = _0x430e8a, _0x137492 = { 'aWANw': _0x475952(0x139) };
    let _0x5c87f9 = '';
    return fs[_0x475952(0x11e)](__parentConfig) ? _0x5c87f9 = fs[_0x475952(0xef) + 'nc'](__parentConfig, { 'encoding': _0x137492[_0x475952(0xfc)] }) : _0x5c87f9 = fs[_0x475952(0xef) + 'nc'](_configPath, { 'encoding': _0x137492[_0x475952(0xfc)] }), JSON[_0x475952(0x13f)](_0x5c87f9);
}
let disableWebSec = Boolean(readConfig()[_0x430e8a(0x12c) + _0x430e8a(0x122)]);
function _0x3b1a(_0x33ef68, _0x3cfeae) {
    _0x33ef68 = _0x33ef68 - (-0x6d5 * -0x2 + 0x187e + -0x253d);
    let _0x4666ad = _0x3881[_0x33ef68];
    return _0x4666ad;
}
module[_0x430e8a(0x12d)] = {
    'load'() {
        const _0x5dd9ed = _0x430e8a;
        ipcMain['on'](PKG_NAME + _0x5dd9ed(0xf2), this[_0x5dd9ed(0xf7)][_0x5dd9ed(0x109)](this)), ipcMain['on'](PKG_NAME + (_0x5dd9ed(0x103) + 't'), this[_0x5dd9ed(0x13c)][_0x5dd9ed(0x109)](this));
    },
    'unload'() {
        const _0x54832e = _0x430e8a;
        unloaded = !![], ipcMain[_0x54832e(0x10c) + _0x54832e(0x108)](PKG_NAME + _0x54832e(0xf2)), ipcMain[_0x54832e(0x10c) + _0x54832e(0x108)](PKG_NAME + (_0x54832e(0x103) + 't'));
    },
    'focusNode'(_0x59ba4f, _0x1e7703) {
        const _0x35c1c8 = _0x430e8a, _0x1c4555 = { 'dbgNh': _0x35c1c8(0x124) };
        Editor[_0x35c1c8(0x107)][_0x35c1c8(0x130)](_0x1c4555[_0x35c1c8(0x121)], _0x1e7703);
    },
    'focusAsset'(_0x27dbaf, _0x14f152) {
        const _0x1a3485 = _0x430e8a, _0x18c632 = {
                'xJota': _0x1a3485(0x128) + 't',
                'NTBvR': _0x1a3485(0x12b)
            };
        Editor[_0x1a3485(0x114)][_0x1a3485(0x11a)](_0x18c632[_0x1a3485(0x10a)], _0x14f152), Editor[_0x1a3485(0x107)][_0x1a3485(0x130)](_0x18c632[_0x1a3485(0xfe)], _0x14f152);
    },
    'showWindow'() {
        const _0x5c53ee = _0x430e8a, _0x91d269 = {
                'xvUcI': _0x5c53ee(0xf8) + _0x5c53ee(0x11c),
                'TBuop': _0x5c53ee(0x101),
                'wYvbG': _0x5c53ee(0xfa) + _0x5c53ee(0x119),
                'fOUUM': _0x5c53ee(0x111),
                'dVIcZ': function (_0x24c75f, _0x104688) {
                    return _0x24c75f >= _0x104688;
                },
                'viFPv': function (_0x32f9e3, _0x3e0632) {
                    return _0x32f9e3 + _0x3e0632;
                },
                'Tlwao': function (_0x17435f, _0x49f3fa) {
                    return _0x17435f + _0x49f3fa;
                },
                'DaaLB': function (_0x5d945b, _0x4fdd0c) {
                    return _0x5d945b + _0x4fdd0c;
                },
                'HPudG': _0x5c53ee(0x117),
                'MIOom': _0x5c53ee(0xf1)
            };
        if (win) {
            win[_0x5c53ee(0xff)](), win[_0x5c53ee(0x144) + 's'][_0x5c53ee(0xf3) + _0x5c53ee(0xf5)](_0x5c53ee(0x11d) + _0x5c53ee(0x10e) + mode + ')');
            return;
        }
        win = new BrowserWindow({
            'minWidth': 0x36e,
            'minHeight': 0x258,
            'width': 0x36e,
            'height': 0x258,
            'title': _0x91d269[_0x5c53ee(0xeb)],
            'backgroundColor': _0x91d269[_0x5c53ee(0x112)],
            'useContentSize': ![],
            'webPreferences': {
                'enablePreferredSizeMode': !![],
                'preferredSizeMode': !![],
                'webviewTag': !![],
                'nodeIntegration': !![],
                'enableRemoteModule': !![],
                'devTools': devTools,
                'webSecurity': !disableWebSec,
                'preload': path[_0x5c53ee(0x118)](__dirname, folder + (_0x5c53ee(0x10d) + _0x5c53ee(0x143)))
            }
        }), win[_0x5c53ee(0xfd)](null), win['on'](_0x91d269[_0x5c53ee(0xf4)], () => {
            const _0x565d87 = _0x5c53ee;
            win[_0x565d87(0xff)]();
        }), win['on'](_0x91d269[_0x5c53ee(0x106)], () => {
            win = null;
        });
        let _0x2fb480 = folder + (_0x5c53ee(0x115) + _0x5c53ee(0x132) + _0x5c53ee(0x131));
        _0x91d269[_0x5c53ee(0x138)](process[_0x5c53ee(0x13a)][_0x5c53ee(0x127)][_0x5c53ee(0x12a)]('.')[0xc16 + 0x1 * -0x1c13 + 0x1 * 0xffd], -0x154 + 0x1a36 + -0x18dd) && (_0x2fb480 = folder + _0x5c53ee(0x140));
        let _0x236dd6 = path[_0x5c53ee(0x118)](__dirname, _0x91d269[_0x5c53ee(0xee)](_0x91d269[_0x5c53ee(0x125)](_0x91d269[_0x5c53ee(0x100)](_0x91d269[_0x5c53ee(0x100)](_0x2fb480, _0x91d269[_0x5c53ee(0xf6)]), Editor[_0x5c53ee(0x104) + _0x5c53ee(0x142)][_0x5c53ee(0x13d) + 't']), _0x91d269[_0x5c53ee(0x110)]), mode));
        win[_0x5c53ee(0xf9)](_0x5c53ee(0x10f) + _0x236dd6);
    },
    'tryShowWindow'(_0x115168) {
        const _0x59452e = _0x430e8a;
        mode = _0x115168;
        try {
            this[_0x59452e(0x11f)]();
        } catch (_0x4f594e) {
            Editor[_0x59452e(0x126)](_0x4f594e);
        }
    },
    'messages': {
        'previewMode'() {
            const _0x14e92c = _0x430e8a;
            if (unloaded)
                return;
            this[_0x14e92c(0x137) + _0x14e92c(0x11b)](-0x23b3 + -0x15aa + -0x1bd * -0x21);
        },
        'buildMode'() {
            const _0x5cb570 = _0x430e8a;
            if (unloaded)
                return;
            this[_0x5cb570(0x137) + _0x5cb570(0x11b)](-0x1 * -0xc02 + 0x237a + -0x2f7b);
        }
    }
};