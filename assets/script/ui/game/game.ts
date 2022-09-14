import { _decorator, Component, Node, Vec3, UITransform, Prefab, instantiate } from 'cc';
import { gameTipManage } from '../../manage/gameTipManage';
const { ccclass, property } = _decorator;

@ccclass('game')
export class game extends Component {

    @property(Node)
    private moveNode: Node = null;

    @property(Node)
    private bg: Node = null;

    @property(Prefab)
    private farm: Prefab = null;

    @property(Prefab)
    private gameTip:Prefab = null;


    private startPos: Vec3;
    private maxMoveX = 0;
    private maxMoveY = 0;


    onLoad() {
        this.node.on(Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.touchMove, this);

        this.maxMoveX = this.bg.getComponent(UITransform).width / 2 - screen.width;
        this.maxMoveY = this.bg.getComponent(UITransform).height / 2 - screen.height;

        //加载游戏提示层
        gameTipManage.instance.init(this.gameTip);

        this.moveNode.addChild(instantiate(this.farm));
    }

    touchStart(event) {
        let touchLoc = event.getLocation();
        this.startPos = touchLoc;
    }

    touchMove(event) {
        let touchLoc = event.getLocation();
        let padX = this.moveNode.position.x - (this.startPos.x - touchLoc.x);
        let padY = this.moveNode.position.y - (this.startPos.y - touchLoc.y);
        this.startPos = touchLoc;
        if (padX >= this.maxMoveX || padX <= -this.maxMoveX) {
            padX = this.moveNode.position.x
        }
        if (padY >= this.maxMoveY || padY <= -this.maxMoveY) {
            padY = this.moveNode.position.y
        }
        this.moveNode.setPosition(padX, padY);
    }


}

