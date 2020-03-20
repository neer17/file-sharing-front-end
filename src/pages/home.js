/* eslint-disable */

import React, { Component } from "react"
import axios from "axios"
import jwt from "jsonwebtoken"

import TopPartHome from "../components/top-part-home"
import HomeForm from "./../components/home-form"
import HomeUploading from "./../components/home-uploading"
import HomeUploadSent from "./../components/home-upload-sent"
import Panel from "./../components/Panel"
import { MyContext } from "./../components/Provider"
import Authentication from "../components/authentication"
import Carousel from "./../components/carousel"
import { url } from "./../utils/domainConfig"

/*
 * The state of this class is maintained using "Context" APi
 * "Provider.js" only contains the state of this class
 * states are being updated from "login.js" to update the "isAuthenticated" and "componentToRender" members after login as well
 * */
class Home extends Component {
  componentDidMount() {
    console.info("home.js componentDidMount")
  }

  /*
   * This method would run in the second render when the global state in Provider.js" would change after login and
   * then it would set a timer that would check the expiration if the token generated at the time of sign-in and log-in
   * */
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { isAuthenticated } = this.context.getState()

    /* if (isAuthenticated) {
      const userId = localStorage.getItem("userId")

      //  making a POST request to /check-validation to check the expiration of user session
      const setIntervalCountdown = setInterval(() => {
        axios
          .post(`${url}/check-validation`, {
            userId
          })
          .catch(err => {
            if (err.response.status === 401) {
              clearInterval(setIntervalCountdown)

              this.context.updateState({
                componentToRender: "Authentication",
                isAuthenticated: false
              })
            }
          })
      }, 1000 * 60 * 60 * 24)
    } */
  }

  //  switching the components
  _renderComponent = () => {
    const state = this.context.getState()
    const { componentToRender } = state

    console.info("componentToRender ==> ", componentToRender)

    switch (componentToRender) {
      case "HomeUploading":
        let type = null,
          payload = null

        try {
          type = state.uploadEvent.type
          payload = state.uploadEvent.payload
        } catch (err) {
          console.error(err)
        }

        return (
          <HomeUploading
            type={type}
            payload={payload}
            onCancel={() => {
              this.context.updateState({
                componentToRender: "HomeForm",
                uploadEvent: null,
                data: null
              })
            }}
          />
        )
      case "HomeUploadSent":
        return (
          <HomeUploadSent
            onSendAnotherFile={() => {
              this.context.updateState({
                componentToRender: "HomeForm"
              })
            }}
            data={state.data}
          />
        )

      case "Authentication":
        return <Authentication />

      //  this would run if the "componentToRender" == "HomeForm" or otherwise
      case "HomeForm":
        return (
          <HomeForm
            onUploading={events => {
              const { type } = events

              const componentToRender =
                type === "success" ? "HomeUploadSent" : "HomeUploading"
              let data = type === "success" ? events.payload.data : null

              this.context.updateState({
                componentToRender,
                uploadEvent: events,
                data
              })
            }}
          />
        )
    }
  }

  cancel = fileName => {
    this.context.cancel(fileName)
  }

  closePanel = () => {
    this.context.updateState({
      showMoreFilesPanel: false
    })
  }

  render() {
    console.info("render")
    const files = this.context.getState().files
    const showMoreFilesPanel = this.context.getState().showMoreFilesPanel

    return (
      <div className={"home-container container"}>
        <div className="home-row-1 row">
          <TopPartHome />
        </div>

        <div className="home-row-2 row">
          {/* LEFT PART  */}
          <div className="home-left-container d-none d-lg-block col-6 pl-0 pr-0">
            <Carousel />
          </div>

          {/* RIGHT PART ( this changes based on values in Provider.js ) */}
          <div className="home-right-container col col-lg-6 ">
            {this._renderComponent()}
          </div>

          {/* MORE FILES PANEL */}
          {showMoreFilesPanel === true ? (
            <Panel />
          ) : null}
        </div>
      </div>
    )
  }
}

/* //  By doing this the context of "Provider.js" would be available in the props (this.context)
const withContext = Component => {
  return props => {
    return (
      <MyContext.Consumer>
        {context => {
          return <Component {...props} context={context} />
        }}
      </MyContext.Consumer>
    )
  }
} */

Home.contextType = MyContext

export default Home
