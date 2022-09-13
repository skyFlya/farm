import { _decorator, Component, Node, CCObject, find } from 'cc';
import { gameData } from './const/gameData';
import { uiNameConst } from './const/uiNameConst';
import { uiManager } from './framework/uiManager';

import { dataManage } from './manage/dataManage';
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

        //添加游戏层
        uiManager.instance.showDialog(uiNameConst.Game, null, null, this.gameLayout);

        //添加ui层          
        uiManager.instance.showDialog(uiNameConst.Home, null, null, this.uiLayout);
    }

    update(deltaTime: number) {

    }
}

