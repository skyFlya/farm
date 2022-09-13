import { _decorator, Component, Node, Sprite } from 'cc';
import { gameData } from '../../const/gameData';
import { pathConst } from '../../const/pathConst';
import { resourceUtil } from '../../framework/resourceUtil';
const { ccclass, property } = _decorator;

@ccclass('farmItem')
export class farmItem extends Component {

    @property(Sprite)
    private landSpr: Sprite = null;

    @property(Sprite)
    private tipImg: Sprite = null;

    init(farmData: gameData.farmData) {
        let landPath = pathConst.FARM_LAND + "/" + (Number(farmData.lv) + 1 + "");
        resourceUtil.setSpriteFrame(landPath, this.landSpr, () => {

        });

        if(farmData.curCropper != null){
            if(Number(farmData.curtime) <= 0){
                
            }
        }
    }


}

