import { Component, Label } from "cc";

export namespace gameData {
    export interface farmData {
        lv: string,
        gold: string,
        curCropper: number,
        curtime: number,
        isOpen: boolean,
    }

    export interface timerItem {
        ts: Component,               //文本
        isCanAdd: boolean            //是否能加速
        time: number,                //剩余时间
    }

    export enum fishState {
        move = 1,
        click = 2,
    }

    export const fishScale = 0.7;
    export const fishSKeWidth = 450 * fishScale;
    export const fishSKeHeight = 450 * fishScale;
}
