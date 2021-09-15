import React, { Component } from 'react'
import './App.css'
import * as PIXI from 'pixi.js'
import { AppConsumer, Stage, withPixiApp } from '@inlet/react-pixi'
import Square from './PixiComponent/Square'
import Wheel from './PixiComponent/Wheel'
import gsap from 'gsap'
import PixiPlugin from 'gsap/PixiPlugin'
import Button from './PixiComponent/Button'
import { Route, Router, Switch } from 'react-router'
import Home from './pages/Home'
import Game from './pages/Game'

export default class App extends Component {

	state = {
		width: 720, height: 1280
	}

	constructor(){
		super()
		this.renderer = PIXI.autoDetectRenderer()
		this.gameRef = React.createRef()
		this.clickEvent = this.clickEvent.bind(this)

		gsap.registerPlugin(PixiPlugin)
		this.wheelRef = React.createRef()
	}

	componentDidMount(){
		const div = this.gameRef.current, {clientWidth, clientHeight} = div.parentElement

		const ratio = clientHeight / 1280
		div.style.width = (720 * ratio) + 'px'
		div.style.height = (1280 * ratio) + 'px'
		// this.renderer.resize(720, 1280)
	}

	clickEvent(){
		const wheel = this.wheelRef.current, config = {
			rotation: 0
		}
		gsap.to(config, {ease: 'none', duration: 5, rotation: 360, repeat: -1})
		.eventCallback('onUpdate', ()=>{
			wheel.angle = config.rotation % 360
		})
	}

	render() {
		const {width, height} = this.state
		return (
			<div className="App">
    			<div className="game" ref={this.gameRef}>
					<Switch>
						<Route exact path="/" component={Home}/>
						<Route path="/game" component={Game}/>
					</Switch>
					{/* <Stage width={720} height={1280} options={{autoDensity: false}}>
						<Square width={200} pos={[0, 0]}/>
						<Square width={200} pos={[720-200, 1280-200]}/>
						<Wheel ref={this.wheelRef}/>
						<Button clickEvent={this.clickEvent}/>
					</Stage> */}
				</div>
			</div>
		)
	}
}