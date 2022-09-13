import { _decorator, Component, Node, Prefab, Sprite, Layout, Label, UITransform } from 'cc';
import { gameData } from '../../const/gameData';
import { pathConst } from '../../const/pathConst';
import { poolManager } from '../../framework/poolManager';
import { resourceUtil } from '../../framework/resourceUtil';
import { dataManage } from '../../manage/dataManage';
import { farmItem } from './farmItem';
const { ccclass, property } = _decorator;

@ccclass('farm')
export class farm extends Component {

    @property(Prefab)
    private landPre: Prefab = null;

    @property(Prefab)
    private landTip: Prefab = null;

    @property(Node)
    private landNode: Node = null;

    @property(Node)
    private tipNode: Node = null;

    private server_framAllData: gameData.farmData[] = [];

    onLoad() {
        /**因为没有数据所以先伪造一些数据 */
        let data = dataManage._instance.getFarmData(1);
        data.curCropper = 1;
        data.curtime = 30;
        data.isOpen = true;
        this.server_framAllData[this.server_framAllData.length] = data;    

        // this.server_framAllData[this.server_framAllData.length] = dataManage._instance.getFarmData(2);
        // this.server_framAllData[this.server_framAllData.length].curCropper = 1;
        // this.server_framAllData[this.server_framAllData.length].curtime = 0;
        // this.server_framAllData[this.server_framAllData.length].isOpen = true;


        // this.server_framAllData[this.server_framAllData.length] = dataManage._instance.getFarmData(3);
        // this.server_framAllData[this.server_framAllData.length].curCropper = 0;
        // this.server_framAllData[this.server_framAllData.length].curtime = 0;
        // this.server_framAllData[this.server_framAllData.length].isOpen = true;


        // this.server_framAllData[this.server_framAllData.length] = dataManage._instance.getFarmData(3);
        // this.server_framAllData[this.server_framAllData.length].isOpen = false;

        this.init();
    }

    private init() {
        for (let i = 0; i < this.server_framAllData.length; i++) {
            this.createFarm(this.server_framAllData[i], i);
        }           
    }

    private createFarm(farmData: gameData.farmData, posIndex: number) {
        let farm = poolManager.instance.getNode(this.landPre, this.node);
        let landPath = pathConst.FARM_LAND + "/" + (Number(farmData.lv) + 1 + "");
        resourceUtil.setSpriteFrame(landPath, farm.getChildByName("spr").getComponent(Sprite), () => {

        });
        farm.on(Node.EventType.TOUCH_END, () => {
            this.clickLand(posIndex)
        }, this);        
        this.landNode.addChild(farm);

        let landTip = poolManager.instance.getNode(this.landTip, this.node);
        landTip.name = "tip" + posIndex;

        let landTipStr = landTip.getChildByName("lb").getComponent(Label);
        if(farmData.isOpen){
            if(farmData.curCropper){
                if(farmData.curtime > 0){
                    landTipStr.string = "加速";
                }                
                else{
                    landTipStr.string = "收获";
                }
            }
            else{
                landTipStr.string = "种植";
            }
        }
        else{           
            landTipStr.string = "解锁";
        }        
        this.tipNode.addChild(landTip);
        setTimeout(() => {
            landTip.setPosition(farm.position.x, farm.position.y + 150);
        }, 0);        
    }

    private clickLand(posIndex) {
        let landTip = this.tipNode.getChildByName(`tip${posIndex}`);
        if(landTip){
            landTip.active = false;
        }
    }


}

