/* eslint-disable */

import React, { Component } from "react"
import { Route, Router, Switch, withRouter } from "react-router-dom"
import { CookiesProvider } from "react-cookie"
import "bootstrap/dist/css/bootstrap.min.css"
import "./sass_files/style.css"
import WebFont from "webfontloader"

import history from "./utils/history"
import TopPart from "./components/TopPart"
import Home from "./pages/Home"
import ViewFile from "./pages/ViewFile"
import { Provider } from "./components/Provider"
import ErrorBoundary from "./components/ErrorBoundary"

class App extends Component {
  componentDidMount() {
    WebFont.load({
      google: {
        families: ["Roboto Slab:300", "sanss-serif"],
      },
    })
  }

  render() {
    console.info("production", process.env.REACT_APP_PRODUCTION)

    return (
      <Provider>
        <div className="app__main">
          {/* background video */}
          <div className="app__video-div">
            {/*  <video
              playsInline="playsinline"
              autoPlay="autoplay"
              muted="muted"
              loop="loop"
              className="video-background"
            >
              <source
                src={require("./video/Mt_Baker.mp4")}
                type="video/mp4"
              ></source>
            </video> */}
            <img className="video-background" src={require("./images/cover-image-2.jpg")} alt="Cover Image"/>
          </div>

          {/* Top Bar */}
          <div className="app__top-part container">
            <TopPart />
          </div>

          {/* main container */}
          <div className="app__main-container container">
            <ErrorBoundary>
              <Router history={history}>
                <Switch>
                  <Route exact path={"/"} component={Home} />
                  <Route path={"/share/:id"} component={withRouter(ViewFile)} />
                </Switch>
              </Router>
            </ErrorBoundary>
          </div>
        </div>
      </Provider>
    )
  }
}

export default App
