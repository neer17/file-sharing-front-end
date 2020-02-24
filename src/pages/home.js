/* eslint-disable */

import React, { Component } from "react"
import axios from "axios"
import jwt from "jsonwebtoken"

import LeftPartHome from "./../components/left-part-home"
import HomeForm from "./../components/home-form"
import HomeUploading from "./../components/home-uploading"
import HomeUploadSent from "./../components/home-upload-sent"
import { MyContext } from "./../components/Provider"
import Authentication from "../components/authentication"
import { url } from "./../utils/domainConfig"

/*
 * The state of this class is maintained using "Context" APi
 * "Provider.js" only contains the state of this class
 * states are being updated from "login.js" to update the "isAuthenticated" and "componentToRender" members after login as well
 * */
class Home extends Component {
  componentDidMount() {
    console.info("home.js componentDidMount")

    axios.post(``)
  }

  //  switching the components
  _renderComponent = () => {
    const state = this.props.context.getState()
    const { componentToRender } = this.props.context.getState()

    console.info("componentToRender ==> ", componentToRender)

    switch (componentToRender) {
      case "HomeUploading":
        const { type, payload } = state.uploadEvent
        return (
          <HomeUploading
            type={type}
            payload={payload}
            onCancel={() => {
              this.props.context.updateState({
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
              this.props.context.updateState({
                componentToRender: "HomeForm"
              })
            }}
            data={state.data}
          />
        )

      case "Authentication":
        return <Authentication />
      //  this would run if the "componentToRender" == "HomeForm" or otherwise
      default:
        return (
          <HomeForm
            onUploading={events => {
              const { type } = events

              let componentToRender =
                type === "success" ? "HomeUploadSent" : "HomeUploading"
              let data = type === "success" ? events.payload.data : null

              this.props.context.updateState({
                componentToRender,
                uploadEvent: events,
                data
              })
            }}
          />
        )
    }
  }

  render() {
    return (
      <div className={"home-container container"}>
        <div className="home-row-1 row">
          {/* ROW 1 */}
          <div className={""}>
            <LeftPartHome />  
          </div>
        </div>

        <div className="home-row-2 row">
          {/* ROW 2 */}
          <div className="home-col-2 container">{this._renderComponent()}</div>
        </div>
      </div>
    )
  }

  /*
   * This method would run in the second render when the global state in Provider.js" would change after login and
   * then it would set a timer that would check the expiration if the token generated at the time of sign-in and log-in
   * */
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { isAuthenticated } = this.props.context.getState()

    if (isAuthenticated) {
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

              this.props.context.updateState({
                componentToRender: "Authentication",
                isAuthenticated: false
              })
            }
          })
      }, 1000 * 60 * 60 * 24)
    }
  }
}

//  By doing this the context of "Provider.js" would be available in the props (this.props.context)
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
}

export default withContext(Home)
