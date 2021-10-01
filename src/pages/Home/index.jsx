import { nanoid } from 'nanoid'
import React, { Component } from 'react'
import List from '../List'
import XLSX from 'xlsx'
import './index.css'
import {requestServer} from '../../serverAccess'

export default class Home extends Component {

    state = {
        itemArr: []
    }

    constructor(){
        super()
        this.titleRef = React.createRef()
        this.itemRef = React.createRef()
        this.countRef = React.createRef()

        this.reader = new FileReader()
        this.reader.onload = this.processExcel
    }

    /** 送出品項 */
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

    /**
     * 刪除品項
     * @param {*} index 
     * @returns 
     */
    deleteItem = (index)=>{
        return ()=>{
            const {itemArr} = this.state
            itemArr.splice(index, 1)
            this.setState({itemArr})
        }
    }

    /** 上傳檔案 */
    uploadFile = e =>{
        const {files} = e.target
        this.reader.readAsBinaryString(files[0])
    }

    /** 解析 excel */
    processExcel = e =>{
        const {result} = e.target
        const {SheetNames, Sheets} = XLSX.read(result, {type: 'binary'})
        
        for (const name of SheetNames) {
            const data = XLSX.utils.sheet_to_json(Sheets[name], {header: 1})
            if(!data[0])
                break

            const nameIdx = data[0].findIndex(obj => obj === '品項'), countIdx = data[0].findIndex(obj => obj === '數量')
            const arr = data.slice(1).map(data => ({item: data[nameIdx], count: +data[countIdx], id: nanoid()}))

            const {itemArr} = this.state
            this.setState({itemArr: [...itemArr, ...arr]})
        }
    }

    /** 進入遊戲 */
    startGame = async () => {
        const {value: title} = this.titleRef.current
        if(!title){
            alert('沒有設定抽獎名稱')
            return
        }
        
        const apiList = await requestServer('/api')
        console.log('apiList', apiList)
        const postObj = {
            title, itemArr: this.state.itemArr
        }
        const get = await requestServer('/api/set', 'POST', postObj)

        this.setState({title}, ()=>{
            console.log('state', this.state)
            const history = this.props.history
            history.push({pathname: '/game', state: this.state})
        })
    }

    loadDB = async ()=>{
        const {value: title} = this.titleRef.current
        if(!title)
            return

        const result = await requestServer('/api/get', 'POST', {title: title})
        this.setState({itemArr: result.map(item => ({...item, item: item.name, id: nanoid()}))})
        console.log('result', result)
    }

    render() {
        const {itemArr} = this.state
        return (
            <div className="home">
                <h1>設定轉盤</h1>

                <div className="wheel-title">
                    <h3>抽獎名稱</h3>
                    <input ref={this.titleRef} type="text" />
                    <input type="button" value="讀取" onClick={this.loadDB}/>
                </div>
                <span>
                    <p>品項</p>
                    <input type="text" placeholder="品項名稱" ref={this.itemRef}/>
                    <input type="number" placeholder="數量" ref={this.countRef}/>
                    <input type="button" value="送出" onClick={this.submitEvent}/>
                </span>
                <input type="file" onChange={this.uploadFile} accept={'.xls, .xlsx'} placeholder={'選擇excel'}/>
                <List itemArr={itemArr} deleteFn={this.deleteItem}/>
                <input className="start-btn" type="button" value="開始抽獎" onClick={this.startGame}/>
            </div>
        )
    }
}
