import { _decorator, Component, Node, CCObject, find, dynamicAtlasManager } from 'cc';
import { gameData } from './const/gameData';
import { uiNameConst } from './const/uiNameConst';
import { uiManager } from './framework/uiManager';

import { dataManage } from './manage/dataManage';
import { gameTipManage } from './manage/gameTipManage';
import { timerManage } from './manage/timerManage';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {

    @property(Node)
    private gameLayout: Node;

    @property(Node)
    private uiLayout: Node;

    @property(Node)
    private popLayout: Node;

    onLoad() {
        
    }

    start() {        
        //加载数据层
        dataManage.instance.init();

        //加载时间层
        timerManage.instance.init();

        //添加游戏层
        uiManager.instance.showDialog(uiNameConst.Game, null, null, this.gameLayout);

        //添加ui层          
        //uiManager.instance.showDialog(uiNameConst.Home, null, null, this.uiLayout);        
    }

    update(deltaTime: number) {

    }
}

