import React from "react"

import Icon from "./Icon"
import { MyContext } from "./Provider"
import history from "./../utils/history"

class TopPart extends React.Component {
  static contextType = MyContext

  constructor(props, context) {
    super(props, context)
    this.state = {
      color: null,
    }

    this.navigateToComponent = this.navigateToComponent.bind(this)

    this.unlisten = null
  }

  componentDidMount() {
    console.info("history listener attached")
    this.unlisten = history.listen((location) => {
      console.info("history location:", location)
    })
  }

  componentWillUnmount() {
    console.info("history listener de-attached")
    this.unlisten()
  }

  navigateToComponent() {
    const path = history.location.pathname
    if (path !== "/") history.goBack()
    else if ("/")
      // this.context.updateState({
      //   componentToRender: "HomeForm",
      // })
      window.location.reload()
  }

  render() {
    return (
      <div className="top-part__wrapper">
        <div className="d-flex flex-row">
          <div
            className="p-2 paper-plane-icon align-self-center"
            onClick={this.navigateToComponent}
          >
            <Icon />
          </div>
          <div className="h1 p-2">SHARE</div>
        </div>
        <h2 className="h2-home-page">Share your files</h2>
        <h3 className="h3-home-page">Secure.Safe.Free</h3>
      </div>
    )
  }
}

// TopPart.contextType = MyContext

export default TopPart
