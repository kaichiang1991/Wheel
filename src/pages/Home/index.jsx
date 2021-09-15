import { nanoid } from 'nanoid'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import List from '../List'
import './index.css'

export default class Home extends Component {

    state = {
        itemArr: []
    }

    constructor(){
        super()
        this.itemRef = React.createRef()
        this.countRef = React.createRef()
    }

    submitEvent = ()=>{
        // 取得 input 資料
        const {value: item} = this.itemRef.current, {value: count} = this.countRef.current
        // 擋掉資料未填
        if(!item || !count){
            console.log('資料未填', item, count)
            return
        }

        
        const {itemArr} = this.state
        // 擋掉重複品項
        if(itemArr.find(_item => _item.item === item)){
            console.log('品項重複', item)
            return
        }

        const itemObj = {item, count, id: nanoid()}
        this.setState({itemArr: [...itemArr, itemObj]})
    }

    deleteItem = (index)=>{
        return ()=>{
            const {itemArr} = this.state
            itemArr.splice(index, 1)
            this.setState({itemArr})
        }
    }

    render() {
        const {itemArr} = this.state
        return (
            <div className="home">
                <h1>設定轉盤</h1>
                <span>
                    <p>品項</p>
                    <input type="text" placeholder="品項名稱" ref={this.itemRef}/>
                    <input type="number" placeholder="數量" ref={this.countRef}/>
                    <input type="button" value="送出" onClick={this.submitEvent}/>
                </span>
                <List itemArr={itemArr} deleteFn={this.deleteItem}/>
                <Link className="start-btn" to={{pathname: '/game', state: this.state}}>開始抽獎</Link>
            </div>
        )
    }
}
