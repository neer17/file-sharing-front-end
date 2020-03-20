/* eslint-disable */


import React, { Component } from "react"
import { Route, Router, Switch, withRouter } from "react-router-dom"
import { CookiesProvider } from "react-cookie"
import "bootstrap/dist/css/bootstrap.min.css"
import "./sass_files/style.css"
import * as dotenv from "dotenv"
dotenv.config()


import history from "./utils/history"
import Home from "./pages/home"
import ViewFile from "./pages/view-file"
import TopBar from "./components/top-bar"
import LoginForm from "./components/login"
import { Provider } from "./components/Provider"
import Authentication from "./components/authentication"

class App extends Component {
  state = {
    showLoginForm: false
  }

  render() {
    let { showLoginForm } = this.state

    return (
      <div>
        {/* background video */}
        <div className="video-div">
          <video
            playsInline="playsinline"
            autoPlay="autoplay"
            muted="muted"
            loop="loop"
            className="video-background"
          >
            <source
              src="https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4"
              type="video/mp4"
            ></source>
          </video>
        </div>
        {/* main container */}
        <div className={"container"}>
          <Provider>
            {/* <TopBar onShowLoginForm={() => {
                        this.setState({
                            showLoginForm: true
                        })
                    }}/>

                    {showLoginForm ? <LoginForm onClose={() => {
                        //  removing the     from the screen
                        this.setState({
                            showLoginForm: false
                        })
                    }} onSignupOrlogin={() => {
                        this.setState({
                            showLoginForm: false
                        })
                    }
                    }/> : null} */}

            <Router history={history}>
              <Switch>
                <Route exact path={"/"} component={Home} />
                <Route path={"/share/:id"} component={withRouter(ViewFile)} />
              </Switch>
            </Router>
          </Provider>
        </div>
      </div>
    )
  }
}

export default App
