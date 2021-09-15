import { Stage } from '@inlet/react-pixi'
import React, { Component } from 'react'
import Square from '../../PixiComponent/Square'
import GameText from '../../PixiComponent/GameText'
import './index.css'
import { nanoid } from 'nanoid'

export default class Game extends Component {
    render() {
        const {state} = this.props.location
        console.log('state', state)
        return (
            <Stage width={720} height={1280} options={{
                autoDensity: false, transparent: true
            }}>
                {/* 定位用 */}
                <Square width={100} pos={[0, 0]}/>
                {/* 定位用 */}
                <Square width={100} pos={[720-100, 1280-100]}/>
                {
                    state.itemArr.map((_item, index) => <GameText key={nanoid()} x={720} y={0 + index * 50} anchor={[1, -0.2]} text={`${_item.item}: 剩下 ${_item.count}個`} />)
                }
            </Stage>
        )
    }
}
