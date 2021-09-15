import React, { Component } from 'react'
import ListItem from '../ListItem'
import './index.css'

export default class List extends Component {
    render() {
        const {itemArr, deleteFn} = this.props
        return (
            <div className="list">
            {
                itemArr.map((item, index) => <ListItem key={item.id} index={index} {...item} deleteFn={deleteFn}/>)
            }
            </div>
        )
    }
}
