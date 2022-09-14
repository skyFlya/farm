import { _decorator, Component, Node, Label, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('gameTip')
export class gameTip extends Component {

    @property(Label)
    private lbContent:Label = null;
    
    private cd:Function = null;

    onEnable(){
        this.node.on(Node.EventType.TOUCH_END, this.clickCd, this);
    }

    onDisable(){
        this.node.off(Node.EventType.TOUCH_END, this.clickCd, this);
    }

    init(pos:Vec3, str:string, cd:Function){
        this.node.setPosition(pos);
        this.lbContent.string = str;
        this.cd = cd;
    }

    private clickCd(){
        if(this.cd){
            this.cd();
        }
    }
    
}

