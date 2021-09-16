import { PixiComponent } from "@inlet/react-pixi";
import { Graphics } from "pixi.js";

export default PixiComponent('Arrow', {

    create: props => new Graphics(),

    applyProps(instance, oldP, newP){
        instance
        .clear()
        .lineStyle(5, 0)
        .moveTo(0, -15).lineTo(0, 15)
        .lineTo(-40, 0)
        .lineTo(0, -15)
        .endFill()

        instance.position.set(615, 360)
    }
})