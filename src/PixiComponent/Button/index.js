import { PixiComponent } from "@inlet/react-pixi";
import { Container, Graphics, Point, Text, TextStyle } from "pixi.js";

export default PixiComponent('Button', {
    create(){
        return new Graphics()
    },

    didMount(instance, parent){
        instance.interactive = instance.buttonMode = true

        // 按壓行為
        const pressFn = (flag) => {
            instance.tint = flag? 0xDDDDDD: 0xFFFFFF
            instance.position.y = flag? this.origPos.y + 5: this.origPos.y
        }
        instance.on('pointerdown', pressFn.bind(this, true))
        instance.on('pointerup', pressFn.bind(this, false))
        instance.on('pointerupoutside', pressFn.bind(this, false))
        instance.on('pointerup', ()=>{
            this.clickEvent && this.clickEvent()
        })
    },

    applyProps(instance, oldP, newP){
        const {down, clickEvent, x, y, width, height, text} = newP
        instance
        .lineStyle(2, 0)
        .beginFill(0xf5f5f5)
        .drawRect(0, 0, width, height)
        .endFill()
        
        // 文字
        const _text = instance.addChild(new Text(text, new TextStyle({
            fontSize: 32,
            fontFamily: 'Ariel'
        })))
        _text.anchor.set(.5)
        _text.position.set(width / 2, height / 2)
        // this.clickEvent = newP.clickEvent
        
        // 紀錄原始座標
        this.origPos = new Point(x, y)
        this.origPos.copyTo(instance.position)
        instance.pivot.set(width / 2, height / 2)

    }
})