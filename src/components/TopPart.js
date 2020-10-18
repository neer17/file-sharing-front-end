import React from "react"
import { IconContext } from "react-icons"
import { FiSettings } from "react-icons/fi"


import Settings from './Settings'
import Icon from "./Icon"
import { MyContext } from "./Provider"
import history from "./../utils/history"
import { firebase } from "../utils/firebaseAuth"

class TopPart extends React.Component {
  static contextType = MyContext

  constructor(props, context) {
    super(props, context)
    this.TAG = "TopPart"

    this.state = {
      color: null,
      isSettingsClicked: false,
    }

    this.navigateToComponent = this.navigateToComponent.bind(this)

    this.unlisten = null
  }

  componentDidMount() {
    this.unlisten = history.listen((location) => {
      console.info("history location:", location)
    })
  }

  componentWillUnmount() {
    console.info('componentWillUnmount')
    this.unlisten()
  }

  shouldComponentUpdate(nextProps, nextState) {
    const isAuthenticated = this.context.getState().isAuthenticated
    if (isAuthenticated === false)
      this.setState({
        isSettingsClicked: false,
      })

    return true
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

  onSettingsClick = () => {
    const { isSettingsClicked } = this.state

    this.setState({
      isSettingsClicked: !isSettingsClicked,
    })
  }

  logout = () => {
    const { isSettingsClicked } = this.state

    this.setState(
      {
        isSettingsClicked: !isSettingsClicked,
      },
      () => {
        localStorage.clear() //  to clear the token
        firebase.auth().signOut().catch(console.error)
      }
    )
  }

  render() {
    const { isSettingsClicked } = this.state
    const { isAuthenticated } = this.context.getState()

    return (
      <div className="top-part__wrapper">
        <div className="d-flex flex-row">
          <div
            className="p-2 paper-plane-icon align-self-center"
            onClick={this.navigateToComponent}
          >
            <Icon />
          </div>
          <div className="h1 h1-heading p-2">SHARE</div>
          {isAuthenticated ? (
            <div
              className="settings ml-auto p-2"
              onClick={this.onSettingsClick}
            >
              <IconContext.Provider
                value={{
                  color: "red",
                  className: "global-class-name",
                  size: "2rem",
                }}
              >
                <FiSettings />
              </IconContext.Provider>
            </div>
          ) : null}
          
          {isSettingsClicked ? (
            <Settings logout={_ => {
              this.logout()
            }}/>
          ) : null}
        </div>
        <h2 className="h2-home-page">Share your files</h2>
        <h3 className="h3-home-page">Secure.Safe.Free</h3>
      </div>
    )
  }
}

// TopPart.contextType = MyContext

export default TopPart
