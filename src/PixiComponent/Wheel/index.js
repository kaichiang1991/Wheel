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

        const setAngle = newP.setAngle
        const itemArr = Object.keys(newP)
        itemArr.splice(itemArr.indexOf('setAngle'), 1)

        // 計算總共幾份
        const totalCount = itemArr.reduce((pre, curr) => pre + (+(newP[curr].count)), 0)
        const itemCount = itemArr.length
        const radius = 200, colorArr = [0x97CBFF, 0xC2FF68, 0xFF5809, 0xFFD306]
        instance.clear()
        
        let currentDeg = 0, angles = []
        for(let i = 0; i < itemCount; i++){
            const [x, y] = getCirclePos(currentDeg)
            instance
            .lineTo(x, y)
            .beginFill(colorArr[i % colorArr.length])
            .arc(0, 0, radius, deg2Rad(currentDeg), deg2Rad(currentDeg = currentDeg + (360 / totalCount * +newP[i].count)))

            angles.push(currentDeg)
        }
        instance.endFill()

        let repeatAngles = angles.slice().map(angle => angle % 360).sort((a,b) => a - b)
        setAngle(...repeatAngles)
    }
})