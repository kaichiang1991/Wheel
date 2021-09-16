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
import { Power1, Power4, Bounce, Elastic } from 'gsap/all'

const boundEvent = 'boundEvent'     // 碰到邊界的事件
const wheelConfig = {
    eachDuration: 1
}

export default class Game extends Component {

    constructor(){
        super()
        this.wheelRef = React.createRef()
        this.arrowRef = React.createRef()
        this.buttonRef = React.createRef()
    }

    componentDidMount(){
        const arrow = this.arrowRef.current
        // 箭頭抖動
        this.arrowTween = gsap.timeline()
        .to(arrow, {duration: .2, ease: Power1.easeOut, angle: '-=15'})
        .to(arrow, {duration: .45, ease: Elastic.easeOut.config(1.75, .5), angle: '+=15'})
        this.arrowTween.pause()
        .eventCallback('onStart', ()=> console.log('%cstart', 'color:red'))

        arrow.on(boundEvent, ctx => {
            this.arrowTween.isActive() && this.arrowTween.kill()
            this.arrowTween.totalProgress(0).play()
            ctx()
        })
    }

    clickEvent = ()=>{
        const wheel = this.wheelRef.current, arrow = this.arrowRef.current, button = this.buttonRef.current
        button.interactive = false

        const config = {degree: 0}, bound = 10, spinRound = 2
        let remainIndex = 0, remainAngle = 0, flagArr = this.angleArr.map(_ => false), baseAngle = wheel.angle % 360, index = this.angleArr.findIndex(angle => angle >= baseAngle)

        gsap.timeline()
        .to(config, {ease: Power1.easeOut, degree: -10})
        .to(config, {ease: 'none', duration: wheelConfig.eachDuration * spinRound, degree: 360 * spinRound})
        .eventCallback('onUpdate', ()=>{
            wheel.angle = config.degree + baseAngle
            remainIndex = index % this.angleArr.length 
            remainAngle = wheel.angle % 360

            if(!flagArr[remainIndex] && (remainAngle > this.angleArr[remainIndex]) && (remainAngle - this.angleArr[remainIndex]) < bound){
                flagArr[index] = true
                arrow.emit(boundEvent, ()=> {
                    if(++index % flagArr.length == 0){
                        flagArr = flagArr.map(_ => false)
                    }
                })
            }
        })
        .eventCallback('onComplete', this.playResult)
    }

    playResult = ()=>{
        const wheel = this.wheelRef.current, arrow = this.arrowRef.current, button = this.buttonRef.current

        let remainIndex = 0, remainAngle = 0, flagArr = this.angleArr.map(_ => false), baseAngle = wheel.angle % 360, index = this.angleArr.findIndex(angle => angle >= baseAngle)
        const result = 360 * Math.random(), config = {degree: 0}, bound = 10, target = result <= baseAngle? (result + 360): result

        gsap.to(config, {ease: 'none', duration: target / 360 * wheelConfig.eachDuration, degree: target - baseAngle})
        .eventCallback('onUpdate', ()=>{
            wheel.angle = config.degree + baseAngle
            remainIndex = index % this.angleArr.length 
            remainAngle = wheel.angle % 360

            if(!flagArr[remainIndex] && (remainAngle > this.angleArr[remainIndex]) && (remainAngle - this.angleArr[remainIndex]) < bound){
                flagArr[index] = true
                arrow.emit(boundEvent, ()=> {
                    if(++index % flagArr.length == 0){
                        flagArr = flagArr.map(_ => false)
                    }
                })
            }
        })
        .eventCallback('onComplete', ()=>{
            button.interactive = true
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
                <Button ref={this.buttonRef} x={360} y={800} width={200} height={100} text="開始!" clickEvent={this.clickEvent}/>
            </Stage>
        )
    }
}
