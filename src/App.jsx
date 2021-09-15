import React, { Component } from 'react'
import './App.css'
import * as PIXI from 'pixi.js'
import gsap from 'gsap'
import PixiPlugin from 'gsap/PixiPlugin'
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
    			<div className="game-container" ref={this.gameRef}>
					<Switch>
						<Route exact path="/" component={Home}/>
						<Route path="/game" component={Game}/>
					</Switch>
				</div>
			</div>
		)
	}
}