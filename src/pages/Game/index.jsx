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
import { Power1, Elastic } from 'gsap/all'

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
        const {itemArr} = this.props.location.state

        // 把 route 帶來的 props 送入 state
        this.setState({
            itemArr: itemArr.map(item => ({...item, origCount: +item.count, count: +item.count})),
            currentIndex: 0
        }
        , ()=>{
            // 畫面更新後，才有 arrowRef，所以在這裡設定
            // -------------------------------------------
            const wheel = this.wheelRef.current, arrow = this.arrowRef.current
            // 箭頭抖動
            this.arrowTween = gsap.timeline()
            .to(arrow, {duration: .2, ease: Power1.easeOut, angle: '-=15'})
            .to(arrow, {duration: .45, ease: Elastic.easeOut.config(1.75, .5), angle: '+=15'})
            this.arrowTween.pause()
    
            wheel.on(boundEvent, ctx => {
                this.setState({currentIndex: ctx})
                this.arrowTween.isActive() && this.arrowTween.kill()
                this.arrowTween.totalProgress(0).play()
            })
        })
    }

    /** 點擊事件 */
    clickEvent = ()=>{
        const wheel = this.wheelRef.current, arrow = this.arrowRef.current, button = this.buttonRef.current
        button.interactive = false

        const config = {degree: 0}, bound = 10, spinRound = 2
        let remainIndex = 0, remainAngle = 0, baseAngle = wheel.angle % 360, index = this.angleArr.findIndex(angle => angle >= baseAngle)

        gsap.timeline()
        .to(config, {ease: Power1.easeOut, degree: -10})
        .to(config, {ease: 'none', duration: wheelConfig.eachDuration * spinRound, degree: 360 * spinRound})
        .eventCallback('onUpdate', ()=>{
            wheel.angle = config.degree + baseAngle
            remainIndex = index % this.angleArr.length 
            remainAngle = wheel.angle % 360
            this.setCurrentIndex(remainAngle)
        })
        .eventCallback('onComplete', this.playResult)
    }

    /** 播放輪盤結果 */
    playResult = ()=>{
        const wheel = this.wheelRef.current, button = this.buttonRef.current

        let remainIndex = 0, remainAngle = 0, baseAngle = wheel.angle % 360, index = this.angleArr.findIndex(angle => angle >= baseAngle)
        const item = this.getResult(), result = this.getResultAngle(item), config = {degree: 0}, target = result <= baseAngle? (result + 360): result

        gsap.to(config, {ease: 'none', duration: target / 360 * wheelConfig.eachDuration, degree: target - baseAngle})
        .eventCallback('onUpdate', ()=>{
            wheel.angle = config.degree + baseAngle
            remainIndex = index % this.angleArr.length 
            remainAngle = wheel.angle % 360
            this.setCurrentIndex(remainAngle)
        })
        .eventCallback('onComplete', ()=>{
            button.interactive = true
            const {itemArr} = this.state, itemObj = itemArr.find(obj => obj.item === item)
            itemObj.count = itemObj.count - 1
            this.setState({itemArr: [...itemArr]})      // 要吃pure array
        })
    }

    /**
     * 設定目前指到的獎項 index
     * @param {*} angle 角度 degree
     */
    setCurrentIndex = (angle)=>{
        const {itemArr, currentIndex} = this.state
        const totalCount = itemArr.reduce((pre, curr) => pre + curr.origCount, 0)
        const clockwiseAngle = 360 - angle
        const key = itemArr.findIndex((_, idx) => clockwiseAngle <= itemArr.slice(0, idx + 1).reduce((pre, curr) => pre + (curr.origCount / totalCount * 360), 0))

        if(key !== currentIndex){
            this.wheelRef.current.emit(boundEvent, key)     // 通知換邊界了
        }
    }

    /** 取得結果 */
    getResult = ()=>{
        const {itemArr} = this.state, totalCount = itemArr.reduce((pre, curr) => pre + curr.count, 0)
        const index = gsap.utils.random(1, totalCount, 1) - 1
        , key = itemArr.findIndex((_, idx) => itemArr[idx].count > 0 && index < itemArr.slice(0, idx + 1).reduce((pre, curr) => pre + curr.origCount, 0))
        return itemArr[key].item
    }

    /** 取得結果的角度 */
    getResultAngle = (itemName)=>{
        const {itemArr} = this.state
        const totalCount = itemArr.reduce((pre, curr) => pre + curr.origCount, 0)

        const reverse = itemArr.slice().reverse()
            , reverseIndex = reverse.findIndex(obj => obj.item === itemName)
            , preCount = reverse.slice(0, reverseIndex).reduce((pre, curr) => pre + curr.origCount, 0)

        const bottom = preCount / totalCount * 360, top = (preCount + itemArr.find(obj => obj.item === itemName).origCount) / totalCount * 360
        return gsap.utils.random(bottom, top, 1) 
    }
    
    // 紀錄滾輪邊界的角度
    setAngle = (...arr)=>{
        this.angleArr = arr
    }

    render() {
        const {itemArr, currentIndex} = this.state || {}
        const showIndex = this.state? (currentIndex + itemArr.length) % itemArr.length : 0

        return (
            <>
            {
                !this.state? null: 
                <Stage width={720} height={1280} options={{
                    autoDensity: false, transparent: true
                }}>
                    {
                        // 定位用
                        <>
                        <Square width={100} pos={[0, 0]}/>
                        <Square width={100} pos={[720-100, 1280-100]}/>
                        </>
                    }

                    <Container x={360} y={360}>
                        <Wheel ref={this.wheelRef} itemArr={itemArr} setAngle={this.setAngle}/>
                        <Arrow ref={this.arrowRef}/>
                    </Container>
                    <GameText text={itemArr[showIndex].item}/>
                    <Button ref={this.buttonRef} x={360} y={800} width={200} height={100} text="開始!" clickEvent={this.clickEvent}/>

                    {
                        // 獎項資訊
                        itemArr.map((_item, index) => {
                            const {item, count} = _item, text = `${index + 1}. ${item}: 剩下 ${count}個`
                            return <GameText key={nanoid()} x={720} y={700 + index * 50} anchor={[1, -0.2]} text={text} />
                        })
                    }
                </Stage>
            }
            </>
        )
    }
}
