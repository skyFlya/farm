///<reference path="../creator.d.ts" />
//@ts-check


if (!window["__initLogListeners"]) {
    /** @type {{[uuid:string]:cc.Node}} */
    var __nd = {}
    // var mh = window
    /** @type {string} */
    var __lastAtlasId = null
    var __dc = false
    var __toggleDC = function(){
        if (cc.ENGINE_VERSION.startsWith("1.")){
            console.warn("now drawcall function don't support ccc 1.x")
            return
        }        
        __dc = !__dc
        __readyUpdateTree()
    }

    /**
     * 
     * @param {fgui.GObject} go 
     */
    var __getGobjName=function(go){
        let n = go.name
        if(!n){
            if(go.packageItem){
                n = go.packageItem.name
            }else if(go.constructor){
                n = go.constructor.name
            }                
        }
        return n
    }
    /**
     * @method __aa
     * @param {{
     * name?:string,
     * id?:string,
     * active?:boolean, 
     * activeInHierarchy?:boolean
     * children?:any[]
     * selected?:boolean,
     * atlasId?:string,
     * dc?:number,
     * rtype?:string,
     * gobjName?:string,
     * isFairyCom?:boolean,
     * zindex:number,
     * opacityInHierarchy?:number,
     * }} obj 
     * @param {cc.Node} n 
     */
    var __aa = function (obj, n, parentOpacity=255) {
        let isScene = n instanceof cc.Scene
        // if(isScene) console.time("nodeTreeCalc")
        obj.name = n.name
        obj.id = n["_id"]
        obj.zindex = n.zIndex
        obj.isFairyCom = false
        if(n["$gobj"]){
            let go = n["$gobj"]
            obj.gobjName = __getGobjName(go)
            obj.isFairyCom = go instanceof fgui.GComponent
        }
        
        obj.active = isScene ? true : n.active
        if (obj.name.length == 0 && n instanceof cc.Scene) {
            obj.name = "CurrentScene"
        }
        obj.selected = false
        let calcSelfDC = true
        obj.activeInHierarchy = n instanceof cc.Scene ? true : n.activeInHierarchy
        if(__dc && obj.activeInHierarchy && n.opacity && !(n instanceof cc.Scene)){
            let c = n.getComponent(cc.RenderComponent)
            if(c && c.enabled){
                if(c instanceof cc.Sprite){
                    if(c.spriteFrame){
                        /** @type {cc.Texture2D} */
                        let tx = c.spriteFrame["_texture"]
                        if(tx) obj.atlasId = tx["_id"]
                    }
                }else if(c instanceof cc.Label){
                    if(c["_frame"] && c.string.length > 0){
                        let tx = c["_frame"]["_texture"]
                        if(tx) obj.atlasId = tx["_id"]
                    }                    
                }else if(c instanceof cc.Graphics){
                    // if(
                    //     c["_impl"]._paths.length                        
                    // ) {
                    //     try{
                    //         let mbf = c["_assembler"]._buffers[0].meshbuffer
                    //         if(mbf.byteOffset != 0) obj.atlasId = c["_id"]                    
                    //     }catch(e){

                    //     }
                    // }
                    if(c["_impl"]){
                        obj.rtype = "gh"
                        obj.atlasId = c["_id"]
                        calcSelfDC = false
                    }
                    
                }else if(c instanceof cc.Mask){
                    obj.rtype = "mk"
                    obj.atlasId = c["_id"]
                    calcSelfDC = false
                    // console.log(c);
                }else{
                    obj.rtype = "ot"
                }
            }
            
        }
        


        if (!n["__listened"]) {
            let transformChange = /** @param {cc.Node} c*/function (c) {
                // __getNodeDetail(n["_id"])
                if(__syncNodeDetail && n==__lastDetalNode) __readyGetNodeDetail()
            }
            n.on(cc.Node.EventType.POSITION_CHANGED, transformChange)
            n.on(cc.Node.EventType.SCALE_CHANGED, transformChange)
            n.on(cc.Node.EventType.SIZE_CHANGED, transformChange)
            n.on(cc.Node.EventType.ROTATION_CHANGED, transformChange)
            n.on(cc.Node.EventType.COLOR_CHANGED, transformChange)
            n.on(cc.Node.EventType.ANCHOR_CHANGED, transformChange)

            n.on(cc.Node.EventType.CHILD_REMOVED, /** @param {cc.Node} c*/function (c) {
                __deleteFromDt(c)
                delete c["__listened"]
                __readyUpdateTree()
            })
            n.on(cc.Node.EventType.CHILD_ADDED, /** @param {cc.Node} c*/function (c) {
                // __deleteFromDt(c)        
                __readyUpdateTree()
            })

            n.on(cc.Node.EventType.CHILD_REORDER, /** @param {cc.Node} c*/function (c) {
                // __deleteFromDt(c)        
                __readyUpdateTree()
            })

            n.on("active-in-hierarchy-changed", function (c) {
                __readyUpdateTree()
                transformChange(n)
            })
            n["__listened"] = true;
        }
        let dc = 0
        let opacity = obj.opacityInHierarchy = Number(parentOpacity && n.opacity)
        if(__dc && opacity && obj.activeInHierarchy){            
            if(obj.atlasId && __lastAtlasId != obj.atlasId){
                if(calcSelfDC) dc ++
                __lastAtlasId = obj.atlasId
            }
        }
        
        obj.children = n.children.map(sn => {
            __nd[sn["_id"]] = sn            
            return __aa({}, sn, opacity)            
        })

        if(__dc){
            if(opacity && obj.activeInHierarchy){//
                obj.children.forEach(c=>{
                    dc += c.dc
                })
                
                obj.dc =  dc
                let rts = obj.children.map(c=>{
                    return c.rtype
                }).filter(c=>{ return c})

                if(rts.length > 0) obj.rtype = Array.from(new Set(rts.toString().split(","))).join(",")
            }else{
                obj.dc = 0
            }
        }
        // let a = obj.children.filter(a=>{ return a["atlasId"]})
        // obj.atlasId = a.pop() || obj.atlasId       
        // if(isScene) console.timeEnd("nodeTreeCalc") 
        return obj
    }

    var __initLogListeners = function () {
        window.addEventListener('error', (e) => {
            console.error(`${e.message}\n${e.error.stack}`);
        }, true);

        window.addEventListener("unhandledrejection", (e) => {
            console.error(`${e.reason}`);
        }, true);

        let simpleData = function (data) {
            /** @type {string[]} */
            let str = data.map(d => {
                let s = "";

                if ((typeof d != "object" && typeof d != "function")) {
                    s = String(d)
                } else {
                    if (d == null){
                        return "null"
                    }                    
                    let o = {}
                    for (let k in d) {
                        let v = d[k]
                        if (typeof v != "object" && typeof v != "function") {
                            if (v == null){
                                o[k] = "null"
                            }else{
                                o[k] = v
                            }
                        }
                        // if(typeof v == "")
                    }
                    s = JSON.stringify(o, null, "\t")
                }
                return s
            })
            if (str.length == 1) {
                return str[0];//.slice(1,str[0].length-1)
            }
            return str.join(",")//.join("--,--").replace(/\"--,--\"/g, ",");
        }
        let fl = console.log;

        console.log = /** @param {any[]} data */function (...data) {
            fl.call(console, ...data)
            // mh.postMessage({event:"consoleLog", data:simpleData(data)}, "*")
            let b = data.every(d=>{
                let t = typeof d
                return t != "function" && t != "object"
            })
            if(!b){
                sendLog(simpleData(data))
            }else{
                sendLog(cc.js.formatStr(...data))
            }
        }
        let il = console.info
        console.info = /** @param {any[]} data */function (...data) {
            il.call(console,...data)
            // mh.postMessage({event:"consoleInfo", data:simpleData(data)}, "*")
            let b = data.every(d=>{
                let t = typeof d
                return t != "function" && t != "object"
            })
            if(!b){
                sendLog(simpleData(data))
            }else{
                sendLog(cc.js.formatStr(...data))
            }
            
        }
        let el = console.error

        console.error = /** @param {any[]} data */function (...data) {
            el.call(console,...data)            
            // mh.postMessage({event:"consoleError", data:simpleData(data)}, "*")
            let b = data.every(d=>{
                let t = typeof d
                return t != "function" && t != "object"
            })
            if(!b){
                sendError(simpleData(data))
            }else{
                sendError(cc.js.formatStr(...data))
            }
        }
        let wl = console.warn

        console.warn = /** @param {any[]} data */function (...data) {
            wl.call(console,...data)
            // mh.postMessage({event:"consoleWarn", data:simpleData(data)}, "*")            
            let b = data.every(d=>{
                let t = typeof d
                return t != "function" && t != "object"
            })
            if(!b){
                sendWarn(simpleData(data))
            }else{
                sendWarn(cc.js.formatStr(...data))
            }
        }
        return;
        let _fetch = window.fetch;
        let _fetchId = 0
        if (_fetch) {
            /** 
             * @param {RequestInfo} input
             * @param {RequestInit?} init
             */
            let newFetch = function (input, init) {
                let id = _fetchId++
                let url = input
                if (input instanceof Request) {
                    init = input
                    url = input.url
                }
                let { method, headers } = init || { method: "GET", headers: {} }
                let req_headers = JSON.stringify(headers || {})
                let time = Date.now()
                let body = JSON.stringify(init? (init.body || {}) :{})
                // mh.httpStart.postMessage(JSON.stringify(
                //     { id, url, method, req_headers, time, body }
                // ))
                mh.postMessage({event:"httpStart", data:JSON.stringify(
                        { id, url, method, req_headers, time, body })},
                 "*")

                let p = _fetch(input, init).then(async response => {
                    url = response.url
                    if (response.url.startsWith(window.origin)) {
                        url = response.url.split(window.origin)[1]
                    }
                    let rep_headers = "";
                    response.headers.forEach((v, k) => {
                        rep_headers += `${k}:${v}\r\n`
                    })
                    time = Date.now()
                    let ct = response.headers.get('content-type');
                    let clone = response.clone()
                    body = ""
                    if (ct && ct.includes("application/json") || ct.includes("text")) {
                        let text = await clone.text()
                        body = text
                    }
                    let status = clone.statusText
                    // mh.httpEnd.postMessage()
                    mh.postMessage({event:"httpEnd", data:JSON.stringify(
                        { id, url, rep_headers, status, time, body }
                    )}, "*")
                    return response
                })

                p.catch(e => {
                    time = Date.now()
                    // mh.httpEnd.postMessage()
                    mh.postMessage({event:"httpEnd", data:JSON.stringify(
                        { id, url, rep_headers: "", status: String(e), time, body: "" }
                    )}, "*")
                })

                return p
            }
            window.fetch = newFetch
        }

        let _open = XMLHttpRequest.prototype.open
        let _setReqHs = XMLHttpRequest.prototype.setRequestHeader;
        let _send = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.open = function (method, url, async, username, password) {
            this["start"] = { method, url }
            _open.call(this, method, url, async, username, password)
        }
        XMLHttpRequest.prototype.setRequestHeader = function (name, value) {
            if (!this["req_headers"]) {
                this["req_headers"] = {}
            }
            this["req_headers"][name] = value
            _setReqHs.call(this, name, value)
        }
        XMLHttpRequest.prototype.send = function (body) {
            let id = _fetchId++;
            let { method, url } = this["start"]
            let req_headers = JSON.stringify(this["req_headers"] || {})
            let time = Date.now()

            mh.httpStart.postMessage(JSON.stringify(
                { id, url, method, req_headers, time, body: JSON.stringify(body || {}) }
            ))
            let _stc = this.onreadystatechange;
            let _tout = this.ontimeout;
            this.ontimeout = function(e){
                let status = "Error:Request Timeout"
                time = Date.now()
                mh.httpEnd.postMessage(JSON.stringify(
                    { id, url, rep_headers:"", status, time, body:"" }
                ))
            }
            this.onreadystatechange = function (e) {
                if (this.readyState == XMLHttpRequest.DONE) {
                    let ct = this.getResponseHeader('content-type');

                    body = ""
                    if (ct && ct.includes("application/json") || ct.includes("text")) {
                        try {
                            let text = JSON.stringify(this.response) || this.responseText
                            body = text
                        } catch (e) {
                            console.error(e)
                        }
                    }
                    url = this.responseURL || url
                    if (this.responseURL.startsWith(window.origin)) {
                        url = this.responseURL.split(window.origin)[1]
                    }
                    let status = this.statusText
                    time = Date.now()
                    let rep_headers = this.getAllResponseHeaders()
                    mh.httpEnd.postMessage(JSON.stringify(
                        { id, url, rep_headers, status, time, body }
                    ))
                }
                if(_stc) _stc.call(this, e)
            }
            _send.call(this, body)
        }
        
    }

    var __initSf = function (retry=false) {
        if (!window["cc"]) {
            if (!retry) {
                setTimeout(() => {
                    __initSf(true)
                }, 2000);
            }
            if(retry) console.error("maybe this is not a CocosCreator Game")            
            
            return
        }
        cc.log = console.log;
        cc.warn = console.warn;
        cc.error = console.error;

        if(cc.ENGINE_VERSION.startsWith("3.")){
            cc.Sprite = cc.SpriteComponent
            cc.Label = cc.LabelComponent
            cc.Widget = cc.WidgetComponent
            cc.Layout = cc.LayoutComponent
        }
        // cc.view["setCanvasSize"] = function(...data){

        // }
        // try{
        //     let cl = cc.Graphics.prototype.clear;
        //     cc.Graphics.prototype.clear = function(clean){
        //         cl.call(this, clean)
        //         if(this.node.activeInHierarchy){
        //             __readyUpdateTree()
        //         }
        //     }
        //     let st = cc.Graphics.prototype.stroke;
        //     cc.Graphics.prototype.stroke = function(){
        //         st.call(this)
        //         if(this.node.activeInHierarchy){
        //             __readyUpdateTree()
        //         }
        //     }
        //     let fl = cc.Graphics.prototype.fill;
        //     cc.Graphics.prototype.fill = function(){                
        //         fl.call(this)
        //         if(this.node.activeInHierarchy){
        //             __readyUpdateTree()
        //         }
        //     }
        // }catch(e){

        // }
        if(CC_PREVIEW && !cc.ENGINE_VERSION.startsWith("1.")) window.addEventListener("resize", function(e){
            e.stopImmediatePropagation()
            e.stopPropagation()
            __updateResize()
        },{capture:true})
        
        cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, function () {
            // setTimeout(__removeOtherNodes, 1000);
            __removeOtherNodes()
            __readyUpdateTree(true)
            
            // mh.postMessage({event:"gameState",data:cc.game.isPaused()}, "file://")
            sendGameState(cc.game.isPaused())
        })
        if(cc.director.getScene()){
            __readyUpdateTree(true)            
        }

        // let run = cc.game.run;
        // cc.game.run = function (c, ost) {
        //     run.call(cc.game, c, ost)
        //     mh.gameState.postMessage(cc.game.isPaused())
        // }
        // cc.game.restart()
        let op = cc.game.pause;
        cc.game.pause = function () {
            op.call(cc.game)
            // mh.postMessage({event:"gameState",data:cc.game.isPaused()}, "*")
            sendGameState(cc.game.isPaused())
        }

        let or = cc.game.resume;
        cc.game.resume = function () {
            or.call(cc.game)
            // mh.postMessage({event:"gameState",data:cc.game.isPaused()}, "file://")
            sendGameState(cc.game.isPaused())
        }

        cc["_isContextMenuEnable"] = true
        // cc.game.canvas.oncontextmenu = null



    }

    var __updateResize = function(){
        if(!CC_PREVIEW) return
        cc.director.getScene().getComponentsInChildren(cc.Widget).forEach(w=>{
            if(w.isValid){
                if(cc.Widget.AlignMode){
                    if(w.alignMode == cc.Widget.AlignMode.ON_WINDOW_RESIZE) w.updateAlignment()
                }else if(w.enabledInHierarchy){
                    w.updateAlignment()
                }
            }
        })
    }

    var __removeOtherNodes = function(){
        if(cc.ENGINE_VERSION.startsWith("1.")) return
        /** @type {HTMLElement} */
        let ct = document.querySelector("#content")
        if(ct && ct.parentElement != document.body){
            document.body.append(ct)
            // let app = document.querySelector("#app")            
        }
        let cr = document.querySelector(".contentWrap")
        if(cr){
            cr.style.overflow = "hidden";
            cr.style.height = "100%"
            cr.style.width = "100%"
        }
        // let ev = getEventListeners(window).resize.find(f=>f.listener.name=="updateResolution");
        // if(ev){
        //     window.removeEventListener("resize", ev.listener)
        // }
        let d =document.createElement("div")

        d.style.display = "none"
        document.body.append(d)

        let c = Array.from(document.body.children)
        let cvnp = null;
        for(let i=0;i<c.length;i++){
            let e = c[i];
            if(e!= d){
                if (!e.contains(cc.game.canvas)){
                    d.append(e)
                }else{
                    cvnp = e
                }
            }
        }
        if(cvnp){
            // document.body.replaceChild(cc.game.canvas, cvnp)
            // d.append(cvnp)
        }
        __resizeCvn()

    }

    var __resizeCvn = function(){
        if(CC_BUILD) return
        let cvn = cc.game.canvas
        if(cvn){
            if(!cc.ENGINE_VERSION.startsWith("1.") && cc.view["setFrameSize"]){
                cc.view["setFrameSize"](window.innerWidth, window.innerHeight)
                __updateResize()
            }else{
                // cvn.width = window.innerWidth*cc.view.getDevicePixelRatio()
                // cvn.height = window.innerHeight*cc.view.getDevicePixelRatio()
                cvn.style.height = window.innerHeight+"px"
                cvn.style.width = window.innerWidth+"px"
            }
            
        }
    }

    var __reCompile = function () {
        let url = window.location.href + 'update-db';
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                // console.log("compile finished");
                // document.getElementById('recompiling').style.display = 'block';
            }
        };
        xmlHttp.open("GET", url, true); // true for asynchronous 
        xmlHttp.send(null);
    }
    /** @param {cc.Node} n*/
    var __deleteFromDt = function (n) {
        // console.log(`delete ${n["_id"]}`)
        delete __nd[n["_id"]]

        if (n.children) n.children.forEach(cn => {
            __deleteFromDt(cn)
        })
    }
    var __toggleNode = function (id) {
        let n = __nd[id]
        if (n) n.active = !n.active

        __readyUpdateTree()
    }

    var stopSyncDetailOneTime = false
    var __syncNode = function (id, key, value) {
        stopSyncDetailOneTime = true
        let n = __nd[id]
        // console.log("syncNode:",key, value)
        if (key == "angle" && (cc.ENGINE_VERSION.startsWith("2.0") || cc.ENGINE_VERSION.startsWith("1."))){
            key = "rotation"
        }
        if (key == "color"){
            value = cc.Color.BLACK.fromHEX(value)
        }else{
            value = Number(value)
        }
        if (n && n[key] != value){
            n[key] = value
            __readyUpdateTree()
        }
        stopSyncDetailOneTime = false
    }
    /** @param {number[]} colors */
    var __syncNodeColor = function (id, colors) {
        let n = __nd[id]
        colors = colors.map(c => c * 255)
        if (n) n.color = cc.color(...colors)
    }
    var __toggleFps = function () {
        if (!cc.debug){
            let b = !cc.director["isDisplayStats"]()
            cc.director["setDisplayStats"](b)
            return;
        }
        let b = !cc.debug.isDisplayStats()
        cc.debug.setDisplayStats(b)
    }

    var __removeNode = function (id) {
        let n = __nd[id]
        if (n) n.removeFromParent()
    }

    var __fcom = null;
    if (!__fcom && window["fgui"]){
        __fcom = new fgui.GComponent()
    }

    var __lastDetalNode;
    var __getNodeDetail = function (id, includeComps=true) {
        if (!__fcom && window["fgui"]){
            __fcom = new fgui.GComponent()
        }
        let n = __nd[id]
        // let t = Date.now()
        if (n) {
            __lastDetalNode = n
            let {
                name,
                active,
                x, y,
                angle,
                scaleX, scaleY,                
                // width, height,
                // color,
                // opacity,                
                // group
            } = n

            let o = {
                id,
                active,
                // color,
                name,
                x, y,
                angle,
                scaleX, scaleY,
                
                
                // color,
                               
                
            }
            if (cc.ENGINE_VERSION.startsWith("2.0") || cc.ENGINE_VERSION.startsWith("1.")){
                o.angle = n.rotation
            }
            if (cc.ENGINE_VERSION.startsWith("3.")) {
                if (n._uiProps.uiTransformComp){
                    let {
                        width, height,
                        anchorX, anchorY
                    } = n._uiProps.uiTransformComp
                    Object.assign(o, {width, height,
                        anchorX, anchorY
                    })
                    if(n._uiProps.uiComp){
                        /** @type {cc.Color} */
                        let c = n._uiProps.uiComp.color
                        o.color = "#"+c.toHEX("#rrggbb")
                    }
                }
            }else{
                let {
                    width, height,
                    anchorX, anchorY,
                    opacity, 
                    group,
                    skewX, skewY
                } = n
                Object.assign(o, {
                    width, height,
                    anchorX, anchorY,
                    opacity, 
                    group,
                    skewX, skewY
                })
                let c = n.color
                o.color = "#"+c.toHEX("#rrggbb")
            }

            if(includeComps){
                let fguiCom = null;
                if(n["$gobj"]){
                    /** @type {fgui.GObject} */
                    let go = n["$gobj"];
                    let o2 = Object.assign({}, go)
                    for(let k in __fcom){
                        delete o2[k]
                    }
                    o2.name = go["constructor"].name;
                    fguiCom = o2;
                }
                
                /** @type {Array} */
                let a = n["_components"].concat();
                if(fguiCom){
                    a.unshift(fguiCom)
                }
                o.coms = a.map(/** @param {cc.Component} c **/c => {
                    let com = {}
                    for (let k in c) {
                        if (c instanceof cc.Component){
                            if(k.startsWith("_")) continue
                            com.isCC_COM = true
                        } else{
                            com.isCC_COM = false
                        }
                        if (!(k in { name: "", uuid: "", enabled: "" }) && k in cc.Component.prototype) continue
                        let v = c[k]
                        if(v == null) v = "null"
                        let t = typeof v
                        if (t != "function" && t != "object") {
                            let attr = c["constructor"]["__attrs__"]
                            if (attr && attr[`${k}$_$type`] == "Enum"){
                                com[k] = attr[`${k}$_$enumList`].find(item=>{
                                    return item.value == v
                                }).name
                            }else{
                                com[k] = c[k] // t == "boolean" ?String(c[k]):                    
                            }                        
                        } else {

                            
                            if(v instanceof cc.Component){
                                if(!v.node){
                                    com[k] = `${cc.js.getClassName(v)}:@${v.uuid}`
                                }
                                const {uuidPath} = __getPath(v.node)
                                com[k] = `${cc.js.getClassName(v)}:@${v.node?v.node.name:v.node}|${uuidPath.join("//")}`
                            }else if(v instanceof cc.Asset){
                                com[k] = `${cc.js.getClassName(v).slice(3)}:@${v.name}||${v["_uuid"]}`
                            } else if(v instanceof cc.ValueType){
                                com[k] = `${v.constructor.name}:${v.toString()}`
                                
                                
                            }else{
                                
                                if(v.constructor == cc.Node){
                                    const {uuidPath} = __getPath(v)
                                    if (k != "node") com[k] = `Node:@${v.name}|${uuidPath.join("//")}`
                                }else if(!(v instanceof Function)){
                                    if(window["fgui"] && v instanceof fgui.GObject){
                                        const {uuidPath} = __getPath(v.node)
                                        if (k != "node") com[k] = `Node:@${__getGobjName(v)}|${uuidPath.join("//")}`
                                    }else{
                                        com[k] = "$"+(v.constructor?v.constructor.name:"object")
                                    }                                
                                }
                            }
                        }
                    }

                    
                    if (c instanceof cc.Button) {
                        // com["transition"] = cc.Button.Transition[c.transition]
                        if (c.transition != cc.Button.Transition.SPRITE) {
                            delete com["hoverSprite"]
                            delete com["pressedSprite"]
                            delete com["disabledSprite"]
                            delete com["normalSprite"]
                        }else if(c.transition != cc.Button.Transition.COLOR){
                            delete com["hoverColor"]
                            delete com["pressedColor"]
                            delete com["disabledColor"]
                            delete com["normalColor"]
                        }
                    }
                    if (c instanceof cc.Sprite) {
                        // com["sizeMode"] = cc.Sprite.SizeMode[c.sizeMode]
                        // com["type"] = cc.Sprite.Type[c.type]
                        // com["fillType"] = cc.Sprite.FillType[c.fillType]
                        // let BlendFactor = cc.macro.BlendFactor || cc.BlendFunc["BlendFactor"]
                        // com["srcBlendFactor"] = BlendFactor[c.srcBlendFactor]
                        // com["dstBlendFactor"] = BlendFactor[c.dstBlendFactor]
                        if (c.type != cc.Sprite.Type.FILLED) {
                            delete com["fillType"]
                            delete com["fillRange"]
                            delete com["fillStart"]
                            delete com["fillCenter"]
                        }
                    }
                    if (c instanceof cc.Layout) {
                        // com["startAxis"] = cc.Layout.AxisDirection[c.startAxis]
                        // com["horizontalDirection"] = cc.Layout.HorizontalDirection[c.horizontalDirection]
                        // com["verticalDirection"] = cc.Layout.VerticalDirection[c.verticalDirection]
                        // com["resizeMode"] = cc.Layout.ResizeMode[c.resizeMode]
                        // com["type"] = cc.Layout.Type[c.type]

                        if (c.type == cc.Layout.Type.NONE){
                            delete com["horizontalDirection"]
                            delete com["verticalDirection"]
                            delete com["startAxis"]     
                            delete com["spacingX"]        
                            delete com["spacingY"]       
                            delete com["cellSize"]      

                            if (c.resizeMode == cc.Layout.ResizeMode.NONE){
                                delete com["paddingBottom"]
                                delete com["paddingTop"]    
                                delete com["paddingLeft"]
                                delete com["paddingRight"]   
                            }
                        }
                        
                        if (c.type == cc.Layout.Type.HORIZONTAL){
                            delete com["spacingY"]
                            delete com["verticalDirection"]
                            delete com["paddingBottom"]
                            delete com["paddingTop"]
                            
                        }
                        if (c.type == cc.Layout.Type.VERTICAL){
                            delete com["spacingX"]
                            delete com["horizontalDirection"]
                            delete com["paddingLeft"]
                            delete com["paddingRight"]
                        }

                        if (c.resizeMode != cc.Layout.ResizeMode.CHILDREN){
                            delete com["cellSize"]
                        }
                        if (c.type != cc.Layout.Type.GRID){                        
                            delete com["startAxis"]   
                        }
                    }
                    if (c instanceof cc.Widget) {
                        if (cc.Widget.AlignMode){
                            // com["alignMode"] = cc.Widget.AlignMode[c.alignMode]
                        }
                        delete com["isStretchHeight"]
                        delete com["isStretchWidth"]
                        delete com["isAbsoluteHorizontalCenter"]
                        delete com["isAbsoluteVerticalCenter"]
                        delete com["isAbsoluteTop"]
                        delete com["isAbsoluteBottom"]
                        delete com["isAbsoluteRight"]
                        delete com["isAbsoluteLeft"]

                    }
                    if (c instanceof cc.Label) {
                        // com["horizontalAlign"] = cc.Label.HorizontalAlign[c.horizontalAlign]
                        // com["verticalAlign"] = cc.Label.VerticalAlign[c.verticalAlign]
                        // com["overflow"] = cc.Label.Overflow[c.overflow]
                    }
                    return com
                })
                a.length = 0
            }
            o.includeComps = includeComps
            showNodeDetail(o)
        }
    }

    var __toggleComp = function (nodeId, compId) {
        let n = __nd[nodeId]
        if (n) {
            /** @type {[cc.Component]} */
            let a = n["_components"].filter(/** @param {cc.Component} c **/c => {
                return c.uuid == compId
            })
            if (a[0]) {
                a[0].enabled = !a[0].enabled
                __getNodeDetail(nodeId)
                if(__dc)__readyUpdateTree()
            }
        }
    }

    var __removeComp = function (nodeId, compId) {
        let n = __nd[nodeId]
        if (n) {
            /** @type {[cc.Component]} */
            let a = n["_components"].filter(/** @param {cc.Component} c **/c => {
                return c.uuid == compId
            })
            if (a[0]) {
                n.removeComponent(a[0])
                getSchedule().scheduleOnce(() => {
                    __getNodeDetail(nodeId)
                    if(__dc)__readyUpdateTree()
                })
            }
        }
    }

    var getSchedule = function(){
        if(cc.ENGINE_VERSION.startsWith("3.")){
            return cc.director.getScene().getComponentInChildren(cc.Camera)
        }else{
            return cc.Canvas.instance
        }
        
    }

    var __syncNodeDetail = false
    var __getDetailFun
    var __readyGetNodeDetail = function(){
        if(__getDetailFun){
            // getSchedule().unschedule(__getDetailFun)
            return
        }
        if(stopSyncDetailOneTime){
            stopSyncDetailOneTime = false
            return
        }
        if(!__syncNodeDetail) return

        __getDetailFun = ()=>{
            __getDetailFun = null
            if(!__syncNodeDetail) return
            __getNodeDetail(__lastDetalNode["_id"], false)
        }
        getSchedule().scheduleOnce(__getDetailFun)
    }

    // let updateTid = 0
    var __readyUpdateTree = function (force = false) {
        if (!__autoUpdateTree && !force) {
            // mh.canUpdateTree.postMessage("")
            // mh.postMessage({event:"canUpdateTree"}, "*")
            canUpdateTree()
            return
        }
        // console.log("call ready upate")  
        // if (__autoUpdateTree && cc.game.isPaused()){
        //     cc.game.step()
        // }
        getSchedule().unschedule(__updateTree)
        if (Date.now() - __lastTreeTime > 60) {
            __updateTree()
            return
        }
        getSchedule().scheduleOnce(__updateTree)
        if (cc.game.isPaused()){
            setTimeout(function(){
                cc.game.step()
                setTimeout(function(){
                    cc.game.step()
                },0)
            })
        }
    }

    var __lastTreeTime = 0
    var __updateTree = function () {
        let scene = cc.director.getScene()
        if (!scene) return
        if (cc.ENGINE_VERSION.startsWith("1.")){
            __dc = false
        }
        // let s = JSON.stringify(aa({}, scene))
        // mh.updateTree.postMessage(s)
        // mh.postMessage({event:"updateTree",data:}, "*")
        __lastAtlasId = null
        __lastTreeTime = Date.now()
        sendTree(__aa({}, scene))
    }

    var __autoUpdateTree = true

    __initLogListeners()
    __initSf()


    /** @param {string} c */
    var __codeTip = function(c){
        if (c.startsWith("__")) return []
        let a = c.split(".")
        let l = a.pop()
        if (l.includes("(")){
            l = l.split("(")[0]
        }
        l = l.toLowerCase()
        let o = window[a.shift()] || window
        
        if(!o) return []
        while (a.length > 0){
            let k = a.shift()            
            if (!o) return []
            o = o[k]
            
        }
        if(!o) return []
        
        let kvs = []
        let ks = o == cc || o == window ? [] : Object.getOwnPropertyNames(o)
        let kset = new Set(ks)
        for(let k in o){
            // if(k.startsWith("__")) continue
            kset.add(k)
        }
        ks = Array.from(kset)
        for(let k of ks){
            if (k.startsWith("__")) {
                continue
            } 
            let v = o[k]
            if (l != "" && !k.toLowerCase().includes(l)){
                continue
            }
            if(typeof v == "function"){
                /** @type {Function} f */
                let f = v
                if(f.length == 0){
                    kvs.push([k,"function()"])
                }else{
                    let s = f.toString()
                    let vs = s.split("\n").shift()
                    let isNative = s.includes("[native code]")
                    vs = vs.replace("function "+f.name, "function")
                    if (!vs.endsWith("{")) {
                        let i = vs.indexOf("){")
                        let i2 = vs.indexOf(") {")
                        if (i > i2){
                            vs = vs.slice(0, i+1)
                        }else{
                            vs = vs.slice(0, 2+1)
                        }
                    }else{
                        vs = vs.replace("{","")
                    }
                    if (isNative && vs == "function()"){
                        vs = "function("
                        let a = []
                        for(let i = 1;i<=f.length;i++){
                            a.push("arg"+i)
                        }
                        vs += a.join(",") + ")"
                    }
                    kvs.push([k, vs])
                }
                
            }else{
                
                if (typeof v == "object"){
                    if (Array.isArray(v)){
                        kvs.push([k, `[](length:${v.length})`])
                    }else{
                        kvs.push([
                            k, v == null ? 
                            "null" : 
                            v.constructor ? v.constructor.name : "object"
                        ])
                    }
                    
                }else{
                    v = typeof v == "string" ? v : String(v)
                    if (v.length > 100) {
                        v = v.slice(0, 100) + "..."
                    }
                    kvs.push([k, `"${v}"`])
                }
                
            }
        }
        kvs.sort()
        kvs.sort((a,b)=>{
            return a[0].toLowerCase().indexOf(l) - b[0].toLowerCase().indexOf(l)
        })
        return kvs

    }
    
    var __searchComs = function (s) {
        s = s.toLowerCase()
        let cs = cc.director.getScene().getComponentsInChildren(cc.Component)
        cs = cs.filter(c => cc.js.getClassName(c).toLowerCase().includes(s))
        return cs.map(c => {
            let {uuid } = c
            let name = cc.js.getClassName(c)
            
            let {path,uuidPath} = __getPath(c.node)
            return { name, uuid, path, uuidPath}
        })
    }
    
    var __printPath = function(id){
        let path = __getPathByid(id)
        console.log(path);
    }

    var __getPathByid = function(id){
        let n = __nd[id]
        if(n){
            let {path} = __getPath(n)            
            return path
        }else{
            return ""
        }
    }

    var __storeCompInGlobal = function(nodeId, compId){
        let c = __getComp(nodeId, compId)
        if (c) {
            window["comp1"]  = c
            console.log(`component: ${c.name}, store in comp1 already!`);
        }
    }

    var __getComp = function(nodeId, compId){
        let n = __nd[nodeId]
        if(!n) return null
        /** @type {[cc.Component]} */
        let a = n["_components"].filter(/** @param {cc.Component} c **/c => {
            return c.uuid == compId
        })
        return a[0]
    }
    var __storeInGlobal = function(id){
        let n = __nd[id]
        if(n){
            window["temp1"]  = n
            console.log(`node: ${n.name}, store in temp1 already!`);
        }
    }

    var __getUuidPathByPath = function(path){
        let n = cc.find(path)
        if (n){
            let {uuidPath} = __getPath(n)
            return uuidPath
        }
        return []
    }

    /** @param {cc.Node} n */
    var __getPath = function (n){
        let p = [n.name]
        let u = [n.uuid]
        while(n.parent && !(n.parent instanceof cc.Scene)){
            p.push(n.parent.name)
            u.push(n.parent.uuid)
            n = n.parent
        }
        return {path:p.reverse().join("/"), uuidPath:u.reverse()}
    }

    var __clearRect = function(){
        if(__g && __g.node) __g.clear()
    }
    
    var __lowElectron = false
    /** @type {cc.Graphics} */
    var __g = null;
    var __v2 = cc.v2()
    var __drawRect = function(uuid){
        if(!cc.director.getScene()) return;
        if(!__g || !__g.node){
            let n = new cc.Node("INSPECTOR-NODE")
            cc.director.getScene().addChild(n)
            // cc.Canvas.instance.node.addChild(n)
            __g = n.addComponent(cc.Graphics)                        
        }
        let n = __nd[uuid]
        if(n){
            if(!__lowElectron){
                n.convertToWorldSpaceAR(cc.Vec2.ZERO, __v2)
            }else{
                __v2 = n.convertToWorldSpace(cc.Vec2.ZERO)
            }
            let {width,height} = n
            width*=n.scaleX
            height*=n.scaleY
            let cvn = cc.Canvas.instance.node
            if (!__lowElectron) __v2.subSelf(cc.v2(width/2, height/2))
            if (n.anchorX != 0.5){
                __v2.x += width*(0.5-n.anchorX);
                    //  addSelf(, n.height/2*n.anchorY))
            }
            if (n.anchorY != 0.5){
                __v2.y += height*(0.5-n.anchorY);
            }
            __g.clear()
            __g.strokeColor = __g.node.color
            __g.lineWidth = cc.view.isRetinaEnabled() ? 4 : 5
                       
            if(width<4 || height < 4){
                __g.circle(__v2.x, __v2.y, 10)
            }else{
                __g.rect(__v2.x, __v2.y, width, height)
            }
            

            __g.stroke()
        }
    }


}

