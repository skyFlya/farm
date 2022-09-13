import { _decorator, Component, Node } from 'cc';
import { util } from '../common/util';
import { gameData } from '../const/gameData';
import { resourceUtil } from '../framework/resourceUtil';
const { ccclass, property } = _decorator;


@ccclass('dataManage')
export class dataManage {
    static _instance: dataManage;

    static get instance() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new dataManage();
        return this._instance;
    }

    private farmJson: gameData.farmData[] = [];

    public init() {
        resourceUtil.getJsonData("json/farm", (err, content) => {            
            this.farmJson = content;
        });
    }

    public getFarmData(lv: number): gameData.farmData {
        let farmJson = this.farmJson;
        for (let i = 0; i < farmJson.length; i++) {
            if (Number(farmJson[i].lv) == lv) {
                return util.Instance.deepCopy(farmJson[i])                
            }
        }
    }


}