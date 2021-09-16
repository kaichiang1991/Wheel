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
import { Power1, Power4 } from 'gsap/src/all'
import { Bounce, Elastic } from 'gsap/all'

const boundEvent = 'boundEvent'     // 碰到邊界的事件

export default class Game extends Component {

    constructor(){
        super()
        this.wheelRef = React.createRef()
        this.arrowRef = React.createRef()
    }

    componentDidMount(){
        const arrow = this.arrowRef.current
        // 箭頭抖動
        this.arrowTween = gsap.timeline()
        .to(arrow, {duration: .2, ease: Power1.easeOut, angle: '-=15'})
        .to(arrow, {duration: .45, ease: Elastic.easeOut.config(1.75, .3), angle: '+=15'})
        this.arrowTween.pause()

        arrow.on(boundEvent, ctx => {
            this.arrowTween.isActive() && this.arrowTween.kill()
            this.arrowTween.totalProgress(0).play()
            ctx()
        })
    }

    clickEvent = ()=>{
        const wheel = this.wheelRef.current, arrow = this.arrowRef.current
        const config = {degree: 0}, bound = 10, spinRound = 2
        let index = 0, remainIndex = 0, remainAngle = 0, flagArr = this.angleArr.map(_ => false), baseAngle = 0

        gsap.timeline()
        .to(config, {ease: Power1.easeOut, degree: -10})
        .to(config, {ease: 'none', duration: 1 * spinRound, degree: 360 * spinRound, onRepeat: ()=>{
            baseAngle += 360
        }})
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
