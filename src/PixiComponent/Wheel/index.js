import { PixiComponent } from "@inlet/react-pixi";
import { Graphics } from 'pixi.js'
import * as PIXI from 'pixi.js'

const radius = 300, colorArr = [0x97CBFF, 0xC2FF68, 0xFF5809, 0xFFD306]
const textStyle = new PIXI.TextStyle({
    fontSize: 32
})

/**
 * 角度轉radian
 * @param {*} degree 
 * @returns 
 */
function deg2Rad(degree){
    return degree * PIXI.DEG_TO_RAD
}

/**
 * 取得圓形角度的切點座標
 * @param {*} degree 角度(degree)
 * @returns 
 */
function getCirclePos(radius, degree){
    const rad = deg2Rad(degree)
    return [Math.cos(rad), Math.sin(rad)].map(num => num * radius)
}

/**
 * 取得 顏色的index
 * @param {*} index 
 * @param {*} length 
 * @returns 
 */
function getColorIndex(index, length){
    const remainder = index % colorArr.length
    // 不是最後一個 or 最後一個但不與第一個重複
    if(index !== length - 1 || remainder !== 0){
        return remainder
    }

    return colorArr.length - 1 - 1      // 倒數第二個
}

export default PixiComponent('Wheel', {
    create: props =>{
        return new Graphics()
    },

    applyProps: (instance, oldP, newP) =>{

        const {setAngle, itemArr} = newP

        // 計算總共幾份
        const totalCount = itemArr.reduce((pre, curr) => pre + curr.origCount, 0)
        const itemCount = itemArr.length
        instance.removeChildren()
        instance.clear().lineStyle(3, 0x000000)
        
        let currentDeg = 0, angles = []
        for(let i = 0; i < itemCount; i++){

            const bottomAngle = currentDeg, topAngle = currentDeg + (360 / totalCount * itemArr[i].origCount)
            const itemLeft = itemArr[i].count > 0           // 獎項是否還有剩

            instance
            .moveTo(0, 0)
            .beginFill(itemLeft? colorArr[getColorIndex(i, itemCount)]: 0x333333, itemLeft? 1: .3)
            .arc(0, 0, radius, deg2Rad(bottomAngle), deg2Rad(topAngle), false)

            // 上面的文字
            const text = instance.addChild(new PIXI.Text(i + 1, textStyle))
            const [textX, textY] = getCirclePos(radius * 0.6, (bottomAngle + topAngle) / 2)
            text.position.set(textX, textY)

            currentDeg = topAngle
            angles.push(currentDeg)
        }

        instance.beginFill(0xFFFFFF)
        .drawCircle(0, 0, 0.2 * radius)
        .endFill()

        const repeatAngles = angles.slice().map(angle => angle % 360).sort((a,b) => a - b)
        setAngle(...repeatAngles)
    }
})