import { PixiComponent } from "@inlet/react-pixi";
import {Graphics} from 'pixi.js'

export default PixiComponent('Square', {
    create(){
        return new Graphics()
    },

    applyProps(instance, oldP, newP){
        const {width, pos: [x, y]} = newP
        instance.clear()
        .beginFill(0xFF0000, .5)
        .drawRect(0, 0, width, width)
        .endFill()

        instance.position.set(x, y)
    }
})