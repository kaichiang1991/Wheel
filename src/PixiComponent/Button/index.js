import { PixiComponent } from "@inlet/react-pixi";
import { Graphics } from "pixi.js";

export default PixiComponent('Button', {
    create(){
        return new Graphics()
    },

    didMount(instance, parent){
        instance.interactive = instance.buttonMode = true
        instance.on('pointerdown', this.clickEvent)
    },

    applyProps(instance, oldP, newP){
        console.log('apply', oldP, newP)
        const {down, clickEvent} = newP
        instance.beginFill(0x0000DD)
        .drawRect(0, 0, 200, 100)
        .endFill()

        this.clickEvent = newP.clickEvent
        instance.position.set(500, 800)
    }
})