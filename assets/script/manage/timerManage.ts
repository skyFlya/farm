import { _decorator, Component, Node } from 'cc';
import { util } from '../common/util';
import { gameData } from '../const/gameData';
const { ccclass, property } = _decorator;

@ccclass('timerManage')
export class timerManage {

    static _instance: timerManage;

    static get instance() {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new timerManage();
        return this._instance;
    }

    private timerArray: gameData.timerItem[] = [];

    public init() {
        setInterval(() => {
            this.timeStart();
        }, 1000)
    }

    private timeStart() {
        let timerArray = this.timerArray;
        for (let i = 0; i < timerArray.length; i++) {
            let timer = timerArray[i];
            if (timer && timer.time > 0) {
                timer.time--;
                if (timer.time <= 0) {
                    timer.time = 0;
                    timer.ts["updateLable"](util.formatTimeForSecond(timer.time));
                    timerArray.splice(i, 1);
                    i--;
                }                
                else{
                    timer.ts["updateLable"](util.formatTimeForSecond(timer.time));
                }
            }
        }
    }

    public addTimer(timer:gameData.timerItem){
        this.timerArray[this.timerArray.length] = timer;
    }

}

