import React, {Component} from 'react'

import history from './../helper/history'
import {MyContext} from './Provider'

class TopBar extends Component {
    render() {
        const {isAuthenticated} = this.context.getState()

        return (<div className="app-top-bar">
            <div className="app-top-bar-inner">

                <div className="app-top-bar-left">
                    <div className="site-name" onClick={() => {
                        history.push('/')
                    }}>
                        <i className="icon-paper-plane"/>
                    </div>
                </div>
                {isAuthenticated === true ? null : <div className="app-top-bar-right">

                    <div className="app-top-bar-right-inner">

                        <div className="user-profile">
                            <div className="user-profile-picture">
                                <img src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm&f=y"/>
                            </div>
                        </div>
                        <ul className="user-profile-menu">
                            <li onClick={() => {

                                if (this.props.onShowLoginForm) {
                                    this.props.onShowLoginForm(true)
                                }

                            }} className="user-signin-button">Sign in
                            </li>
                        </ul>
                    </div>
                </div>}

            </div>
        </div>)
    }
}

TopBar.contextType = MyContext

export default TopBar