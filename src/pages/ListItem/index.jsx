import React, { Component } from 'react'
import './index.css'

export default class ListItem extends Component {
    render() {
        const { id, index, item, count, deleteFn } = this.props
        return (
            <div className="list-item">
                <span className="item-detail">
                    <p>{index + 1}.</p> <p>{item}</p> <p>{count}個</p>
                </span>
                <input type="button" value="刪除" onClick={deleteFn(id)}/>
            </div>
        )
    }
}
