import { PixiComponent } from "@inlet/react-pixi";
import {Container, Graphics} from 'pixi.js'

export default PixiComponent('Wheel', {
    create: props =>{
        return new Graphics()
    },

    didMount: (instance, parent) =>{
        console.log('mount', instance, parent)
        instance.beginFill(0x00DD00)
        .drawCircle(0, 0, 200)
        .beginFill(0x0000AA)
        .drawRect(0, 0, 200, 100)
        .endFill()

        instance.position.set(200)
    },

    applyProps: (instance, oldP, newP) =>{
        console.log('apply', instance, oldP, newP)
    }
})