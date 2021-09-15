import { Stage, Container } from '@inlet/react-pixi'
import React, { Component } from 'react'
import Square from '../../PixiComponent/Square'
import GameText from '../../PixiComponent/GameText'
import './index.css'
import gsap from 'gsap'
import { nanoid } from 'nanoid'
import Wheel from '../../PixiComponent/Wheel'
import Arrow from '../../PixiComponent/Arrow'
import Button from '../../PixiComponent/Button'
import { Power1 } from 'gsap/src/all'

export default class Game extends Component {

    constructor(){
        super()
        this.wheelRef = React.createRef()
        this.arrowRef = React.createRef()
    }

    clickEvent = ()=>{
        const {current: wheel} = this.wheelRef, {current: arrow} = this.arrowRef

        console.log(this.angleArr)
        
        const config = {degree: 0}, flagArr = this.angleArr.map(_ => false), bound = 1
        let index = 0
        gsap.timeline()
        .to(config, {ease: Power1.easeOut, degree: 0})  // ToDo 之後要拉
        .to(config, {ease: 'none', duration: 1, repeat: -1, degree: 360, onRepeat: ()=>{
            flagArr.map((_, index) => flagArr[index] = false)
            console.log('repeat', flagArr)
        }})
        .eventCallback('onUpdate', ()=>{
            wheel.angle = config.degree

            if(!flagArr[index] && (wheel.angle - this.angleArr[index]) < bound){
                flagArr[index] = true
                console.log('跳', wheel.angle)
                gsap.to(arrow, {duration: .05, angle: '-=10', yoyo: true, repeat: 1})
            }else if(wheel.angle > this.angleArr[index] + bound){
                index = ++index % flagArr.length
            }
        })
    }
    
    // 紀錄滾輪邊界的角度
    setAngle = (...arr)=>{
        this.angleArr = arr
    }

    render() {
        const {itemArr} = this.props.location.state

        return (
            <Stage width={720} height={1280} options={{
                autoDensity: false, transparent: true
            }}>
                {/* 定位用 */}
                <Square width={100} pos={[0, 0]}/>
                <Square width={100} pos={[720-100, 1280-100]}/>

                {
                    itemArr.map((_item, index) => <GameText key={nanoid()} x={720} y={0 + index * 50} anchor={[1, -0.2]} text={`${_item.item}: 剩下 ${_item.count}個`} />)
                }

                <Container>
                    <Wheel {...itemArr} ref={this.wheelRef} setAngle={this.setAngle}/>
                    <Arrow ref={this.arrowRef}/>
                </Container>
                <Button x={360} y={800} width={200} height={100} text="開始!" clickEvent={this.clickEvent}/>
            </Stage>
        )
    }
}
