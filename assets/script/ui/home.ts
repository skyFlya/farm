import { _decorator, Component, Node, Label, CCObject, Sprite } from 'cc';
import { eventName } from '../const/eventName';
import { clientEvent } from '../framework/clientEvent';
const { ccclass, property } = _decorator;

@ccclass('home')
export class home extends Component {

    @property(Label)
    private lbMoney:Label = null;

    @property(Node)
    private btnCreate:Node = null;

    @property(Node)
    private btnOrders:Node = null;

    @property(Node)
    private btnTask:Node = null;

    @property(Node)
    private btnCollection:Node = null;

    onLoad(){
        this.btnCreate.on(Node.EventType.TOUCH_END, this.openCreate, this);
        this.btnOrders.on(Node.EventType.TOUCH_END, this.openOrders, this);
        this.btnTask.on(Node.EventType.TOUCH_END, this.openTask, this);
        this.btnCollection.on(Node.EventType.TOUCH_END, this.openCollection, this);
        

        
        clientEvent.on(eventName.GOLD_UPDATE, this.updateGold, this);
    }

    start() {

    }

    updateGold(){

    }

    openCreate(){
       console.log("建设");
    }

    openOrders(){
        console.log("订单");
    }

    openTask(){

    }

    openCollection(){

    }


    show(){
        console.log("home展示");
    }

    hide(){
        console.log("home隐藏");
    }


}

