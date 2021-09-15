import { Stage } from '@inlet/react-pixi'
import React, { Component } from 'react'
import Square from '../../PixiComponent/Square'

export default class Game extends Component {
    render() {
        const {state} = this.props.location
        console.log('state', state)
        return (
            <Stage width={720} height={1280} options={{
                autoDensity: false
            }}>
                <Square width={200} pos={[0, 0]}/>
                <Square width={200} pos={[720-200, 1280-200]}/>
            </Stage>
        )
    }
}
