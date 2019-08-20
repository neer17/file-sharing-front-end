import React, {Component} from 'react'
import {Route, Router, Switch, withRouter} from 'react-router-dom'
import {CookiesProvider} from 'react-cookie'

import history from './helper/history'
import Home from './pages/home'
import ViewFile from './pages/view-file'
import TopBar from './components/top-bar'
import LoginForm from './components/login'
import {Provider} from './components/Provider'
import './helper.css'
import './App.css'


class App extends Component {

    state = {
        showLoginForm: false
    }

    render() {
        let {showLoginForm} = this.state
        return (
            <div>
                <Provider>
                    <TopBar onShowLoginForm={() => {
                        this.setState({
                            showLoginForm: true
                        })
                    }}/>

                    {showLoginForm ? <LoginForm onClose={() => {
                        //  removing the LoginForm from the screen
                        this.setState({
                            showLoginForm: false
                        })
                    }} onSignupOrlogin={() => {
                        this.setState({
                            showLoginForm: false
                        })
                    }
                    }/> : null}

                    <Router history={history}>
                        <Switch>
                            <Route exact path={'/'} component={Home}/>
                            <Route path={'/share/:id'} component={withRouter(ViewFile)}/>
                        </Switch>
                    </Router>
                </Provider>
            </div>
        )
    }
}

export default App
