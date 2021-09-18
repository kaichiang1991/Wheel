import { Text } from "@inlet/react-pixi";
import * as PIXI from 'pixi.js'

const gameStyle = {
    fill: ['#ffffff', '#000000'], // gradient
    fillGradientType: PIXI.TEXT_GRADIENT.LINEAR_VERTICAL,
    fillGradientStops: [0, 0.7, 1],
    stroke: '#01d27e',
    strokeThickness: 1,
    dropShadow: true,
    dropShadowColor: '#ccced2',
    dropShadowBlur: 0.1,
    dropShadowDistance: 1,

    fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
    fontSize: 32,
}

const GameText = props => <Text {...props} style={{...gameStyle, ...props.style}}/>
export default GameText