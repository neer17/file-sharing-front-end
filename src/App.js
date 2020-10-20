/* eslint-disable */

import React, { Component } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "./sass_files/style.css"
import WebFont from "webfontloader"

import { Provider } from "./components/Provider"
import TopPart from "./components/TopPart"
import AuthListenerWrapper from "./components/AuthListenerWrapper"
import history from './utils/history'

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
      <div className="app__main">
        <div className="app__cover-image">
          <img
            className="cover-image"
            src={require("./images/cover-image.jpg")}
            alt="Cover Image"
          />
        </div>

        <Provider>
          {/* Top Bar */}
          <div className="app__top-part container">
            <TopPart />
          </div>
          <AuthListenerWrapper />
        </Provider>
      </div>
    )
  }
}

export default App
