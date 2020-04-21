/* eslint-disable */

import React, { Component } from "react"
import { Route, Router, Switch, withRouter } from "react-router-dom"
import { CookiesProvider } from "react-cookie"
import "bootstrap/dist/css/bootstrap.min.css"
import "./sass_files/style.css"

import history from "./utils/history"
import TopPart from './components/TopPart'
import Home from "./pages/Home"
import ViewFile from "./pages/ViewFile"
import { Provider } from "./components/Provider"
import ErrorBoundary from "./components/ErrorBoundary"

class App extends Component {
  state = {
    showLoginForm: false,
  }

  render() {
    let { showLoginForm } = this.state

    return (
      <div className="app__main">
        {/* background video */}
        <div className="app__video-div">
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
       
       {/* Top Bar */}
       <div className="app__top-part container">
          <TopPart />
        </div>

        {/* main container */}
        <div className="app__main-container container">
          <ErrorBoundary>
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
          </ErrorBoundary>
        </div>
      </div>
    )
  }
}

export default App
