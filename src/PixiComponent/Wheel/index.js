import { PixiComponent } from "@inlet/react-pixi";
import {Container, Graphics} from 'pixi.js'
import * as PIXI from 'pixi.js'

function deg2Rad(degree){
    return degree * PIXI.DEG_TO_RAD
}

function getCirclePos(degree){
    const rad = deg2Rad(degree)
    return [Math.cos(rad), Math.sin(rad)]
}

export default PixiComponent('Wheel', {
    create: props =>{
        return new Graphics()
    },

    didMount: (instance, parent) =>{
        instance.position.set(360)
    },

    applyProps: (instance, oldP, newP) =>{
        // 計算總共幾份
        const totalCount = Object.values(newP).reduce((pre, curr) => pre + (+curr.count), 0)
        const radius = 200, colorArr = [0xFF0000, 0x00FF00, 0x0000FF]
        instance.clear()
        
        let currentDeg = 0
        for(let i = 0; i < totalCount; i++){
            const [x, y] = getCirclePos(currentDeg)
            instance.lineTo(x, y)
            instance.beginFill(colorArr[i % colorArr.length])
            instance.arc(0, 0, radius, deg2Rad(currentDeg), deg2Rad(currentDeg = currentDeg + (360 / totalCount)))
        }

        instance.endFill()
    }
})