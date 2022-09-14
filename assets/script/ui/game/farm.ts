import { _decorator, Component, Node, Prefab, Sprite, Layout, Label, UITransform, instantiate } from 'cc';
import { util } from '../../common/util';
import { gameData } from '../../const/gameData';
import { pathConst } from '../../const/pathConst';
import { poolManager } from '../../framework/poolManager';
import { resourceUtil } from '../../framework/resourceUtil';
import { dataManage } from '../../manage/dataManage';
import { gameTipManage } from '../../manage/gameTipManage';
const { ccclass, property } = _decorator;

@ccclass('farm')
export class farm extends Component {

    @property(Node)
    private landNode: Node = null;

    @property(Node)
    private tipNode: Node = null;

    @property(Node)
    private tipLbNode: Node = null;

    @property(Node)
    private timerNode: Node = null;

    private unitTime:number = 0;

    private server_framAllData: gameData.farmData[] = [];

    private timeManger = [];

    onLoad() {        
        /**因为没有数据所以先伪造一些数据 */
        let data = dataManage.instance.getFarmData(1);
        data.curCropper = 1;
        data.curtime = 30;
        data.isOpen = true;
        this.server_framAllData[this.server_framAllData.length] = data;

        data = dataManage.instance.getFarmData(2);
        data.curCropper = 1;
        data.curtime = 0;
        data.isOpen = true;
        this.server_framAllData[this.server_framAllData.length] = data;

        this.init();
    }

    private init() {
        for (let i = 0; i < this.server_framAllData.length; i++) {
            let itemData = this.server_framAllData[i];
            this.createFarm(itemData, i);
            this.timeManger[i] = itemData.curtime;
            if(itemData.curtime > 0){
                this.timerNode.children[i].active = true;
            }            
        }
    }

    private createFarm(farmData: gameData.farmData, posIndex: number) {
        let tipContent = ""
        if (farmData.isOpen) {
            if (farmData.curCropper) {
                if (farmData.curtime > 0) {
                    tipContent = "加速";
                }
                else {
                    tipContent = "收获";
                }
            }
            else {
                tipContent = "种植";
            }
        }
        else {
            tipContent = "解锁";
        }

        let farm = this.landNode.children[posIndex];
        let landPath = pathConst.FARM_LAND + "/" + (Number(farmData.lv) + 1 + "");
        resourceUtil.setSpriteFrame(landPath, farm.getComponent(Sprite), () => {

        });
        farm.on(Node.EventType.TOUCH_END, () => {
            this.clickTip(tipContent, posIndex)
        }, this);        

         let tipFrame = this.tipNode.children[posIndex];
         tipFrame.active = true;

         let tipLb = this.tipLbNode.children[posIndex];
         tipLb.active = true;
         tipLb.getComponent(Label).string = tipContent;
    }

    private clickTip(tipContent, posIndex) {
        let tip = this.tipNode.getChildByName(`tip${posIndex}`);
        if (tipContent == "加速") {
            console.log("1");
        }
        else if (tipContent == "收获") {
            console.log("2");
        }
        else if (tipContent == "种植") {
            console.log("3");
        }
        else if (tipContent == "解锁") {
            console.log("4");
        }        
    }        

    public update(dt: number): void {
        this.unitTime += dt;        
        if (this.unitTime < 1) {
            return;
        }       
        this.unitTime--;
        for(let i = 0; i < this.timeManger.length; i++){
            if(this.timeManger[i] && this.timeManger[i] > 0){
                this.timeManger[i]--;

                let item = this.timerNode.children[i];
                if(this.timeManger[i] < 0){
                    item.active = false;
                }
                else{
                    item.getComponent(Label).string = util.formatTimeForSecond(this.timeManger[i]);
                }
            }
        }
        
        //this.label.string = this.time + "";
    }

}

