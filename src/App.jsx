import React, { Component } from 'react'
import './App.css'
import { Route, Switch } from 'react-router'
import Home from './pages/Home'
import Game from './pages/Game'

export default class App extends Component {

	state = {
		width: 720, height: 1280
	}

	constructor(){
		super()
		this.gameRef = React.createRef()
	}

	render() {
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