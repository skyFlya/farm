import { _decorator, Component, Node, Prefab, Vec3 } from 'cc';
import { uiNameConst } from '../const/uiNameConst';
import { poolManager } from '../framework/poolManager';
import { resourceUtil } from '../framework/resourceUtil';
import { gameTip } from '../ui/gameTip';
const { ccclass, property } = _decorator;

@ccclass('gameTipManage')
export class gameTipManage {
    static _instance: gameTipManage;

    static get instance() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new gameTipManage();
        return this._instance;
    }

    private gameTip:Prefab = null;    

    public init(tipPre:Prefab){
        this.gameTip = tipPre;
    }

    public setTip(data:{pos:Vec3, str:string, parent:Node, cd?:Function}){
        let pre = poolManager.instance.getNode(this.gameTip, data.parent);
        pre.getComponent(gameTip).init(data.pos, data.str, data.cd);
        return pre;
    }


}

