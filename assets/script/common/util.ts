import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('util')

export class util {
    private static instance: util = null;

    public static get Instance(): util {
        if (!util.instance) {
            util.instance = new util();
        }
        return util.instance;
    }

    //深度拷贝json对象的函数，
    //source：待拷贝对象
    //返回一个新的对象
    public deepCopy(source): any {
        let newObject: any;
        let isArray = false;
        if ((source as any).length) {
            newObject = [];
            isArray = true;
        } else {
            newObject = {};
            isArray = false;
        }

        for (let key of Object.keys(source)) {
            if (null == source[key]) {
                if (isArray) {
                    newObject.push(null);
                } else {
                    newObject[key] = null;
                }
            } else {
                let sub = (typeof source[key] == 'object') ? this.deepCopy(source[key]) : source[key];
                if (isArray) {
                    newObject.push(sub);
                } else {
                    newObject[key] = sub;
                }
            }
        }
        return newObject;
    }

    /**
 * !#zh 拷贝object。
 */
    public static clone(sObj: any) {
        if (sObj === null || typeof sObj !== "object") {
            return sObj;
        }

        let s: any = {};
        if (sObj.constructor === Array) {
            s = [];
        }

        for (const i in sObj) {
            if (sObj.hasOwnProperty(i)) {
                s[i] = this.clone(sObj[i]);
            }
        }

        return s;
    }

    public static getRandomInt(min: number, max: number) {
        const r = Math.random();
        const rr = r * (max - min + 1) + min;
        return Math.floor(rr);
    }

    public static getStringLength(render: string) {
        const strArr = render;
        let len = 0;
        for (let i = 0, n = strArr.length; i < n; i++) {
            const val = strArr.charCodeAt(i);
            if (val <= 255) {
                len = len + 1;
            } else {
                len = len + 2;
            }
        }

        return Math.ceil(len / 2);
    }

    /**
     * 判断传入的参数是否为空的Object。数组或undefined会返回false
     * @param obj
     */
    public static isEmptyObject(obj: any) {
        let result = true;
        if (obj && obj.constructor === Object) {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    result = false;
                    break;
                }
            }
        } else {
            result = false;
        }

        return result;
    }

    public static formatNum(num: number) {
        // 0 和负数均返回 NaN。特殊处理。
        if (num <= 0) {
            return '0';
        }

        const k = 1000;
        const sizes = ['', '', 'K', 'M', 'B'];
        const i = Math.round(Math.log(num) / Math.log(k));
        return parseInt((num / (Math.pow(k, i - 1 < 0 ? 0 : i - 1))).toString(), 10) + sizes[i];
    }

    /**
     * 判断是否是新的一天
     * @param {Object|Number} dateValue 时间对象 todo MessageCenter 与 pve 相关的时间存储建议改为 Date 类型
     * @returns {boolean}
     */
    public static isNewDay(dateValue: any) {
        // todo：是否需要判断时区？
        const oldDate = new Date(dateValue);
        const curDate = new Date();

        const oldYear = oldDate.getFullYear();
        const oldMonth = oldDate.getMonth();
        const oldDay = oldDate.getDate();
        const curYear = curDate.getFullYear();
        const curMonth = curDate.getMonth();
        const curDay = curDate.getDate();

        if (curYear > oldYear) {
            return true;
        } else {
            if (curMonth > oldMonth) {
                return true;
            } else {
                if (curDay > oldDay) {
                    return true;
                }
            }
        }

        return false;
    }

    public static getPropertyCount(o: Object) {
        let n, count = 0;
        for (n in o) {
            if (o.hasOwnProperty(n)) {
                count++;
            }
        }
        return count;
    }

    /**
     * 返回一个差异化数组（将array中diff里的值去掉）
     * @param array
     * @param diff
     */
    public static difference(array: any, diff: any) {
        const result: number[] = [];
        if (array.constructor !== Array || diff.constructor !== Array) {
            return result;
        }

        const length = array.length;
        for (let i = 0; i < length; i++) {
            if (diff.indexOf(array[i]) === -1) {
                result.push(array[i]);
            }
        }

        return result;
    }

    // 模拟传msg的uuid
    public static simulationUUID() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    public static trim(str: string) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    }

    /**
     * 判断当前时间是否在有效时间内
     * @param {String|Number} start 起始时间。带有时区信息
     * @param {String|Number} end 结束时间。带有时区信息
     */
    public static isNowValid(start: string | number, end: string | number) {
        const startTime = new Date(start);
        const endTime = new Date(end);
        let result = false;

        if (startTime.getDate() + '' !== 'NaN' && endTime.getDate() + '' !== 'NaN') {
            const curDate = new Date();
            result = curDate < endTime && curDate > startTime;
        }

        return result;
    }

    public static getDeltaDays(start: string | number, end: string | number) {
        const startData = new Date(start);
        const endData = new Date(end);

        const startYear = startData.getFullYear();
        const startMonth = startData.getMonth() + 1;
        const startDate = startData.getDate();
        const endYear = endData.getFullYear();
        const endMonth = endData.getMonth() + 1;
        const endDate = endData.getDate();

        start = new Date(startYear + '/' + startMonth + '/' + startDate + ' GMT+0800').getTime();
        end = new Date(endYear + '/' + endMonth + '/' + endDate + ' GMT+0800').getTime();

        const deltaTime = end - start;
        return Math.floor(deltaTime / (24 * 60 * 60 * 1000));
    }

    public static getMin(array: any) {
        let result = 0;
        if (array.constructor === Array) {
            const length = array.length;
            for (let i = 0; i < length; i++) {
                if (i === 0) {
                    result = Number(array[0]);
                } else {
                    result = result > Number(array[i]) ? Number(array[i]) : result;
                }
            }
        }

        return result;
    }

    public static formatTwoDigits(time: number) {
        return (Array(2).join('0') + time).slice(-2);
    }

    public static formatDate(date: Date, fmt: string) {
        const o: { [name: string]: number } = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };

        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (const k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (`${o[k]}`) : ((`00${o[k]}`).substr(("" + o[k]).length)));
        return fmt;
    }

    /**
     * 获取格式化后的日期（不含小时分秒）
     */
    public static getDay() {
        const date = new Date();

        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    }

    /**
     * 格式化钱数，超过10000 转换位 10K   10000K 转换为 10M
     */
    public static formatMoney(money: number) {
        const arrUnit = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y', 'B', 'N', 'D'];

        let strValue = '';
        for (let idx = 0; idx < arrUnit.length; idx++) {
            if (money >= 10000) {
                money /= 1000;
            } else {
                strValue = Math.floor(money) + arrUnit[idx];
                break;
            }
        }

        if (strValue === '') {
            strValue = Math.floor(money) + 'U'; //超过最大值就加个U
        }

        return strValue;
    }

    /**
     * 根据剩余秒数格式化剩余时间 返回 HH:MM:SS
     * @param {Number} leftSec
     */
    public static formatTimeForSecond(leftSec: number) {
        let timeStr = '';
        const sec = leftSec % 60;

        let leftMin = Math.floor(leftSec / 60);
        leftMin = leftMin < 0 ? 0 : leftMin;

        const hour = Math.floor(leftMin / 60);
        const min = leftMin % 60;

        if (hour > 0) {
            timeStr += hour > 9 ? hour.toString() : '0' + hour;
            timeStr += ':';
        }

        timeStr += min > 9 ? min.toString() : '0' + min;
        timeStr += ':';
        timeStr += sec > 9 ? sec.toString() : '0' + sec;
        return timeStr;
    }

    /**
     *  根据剩余毫秒数格式化剩余时间 返回 HH:MM:SS
     *
     * @param {Number} ms
     */
    public static formatTimeForMillisecond(ms: number) {
        let second = Math.floor(ms / 1000 % 60);
        let minute = Math.floor(ms / 1000 / 60 % 60);
        let hour = Math.floor(ms / 1000 / 60 / 60);
        let strSecond = second < 10 ? '0' + second : second;
        let strMinute = minute < 10 ? '0' + minute : minute;
        let strHour = hour < 10 ? '0' + hour : hour;
        return `${strSecond}:${strMinute}:${strHour}`;
    }
}
