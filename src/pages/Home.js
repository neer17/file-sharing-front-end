/* eslint-disable */

import React, { Component } from "react"

import Authentication from "../components/Authentication"
import HomeForm from "../components/HomeForm"
import HomeUploading from "../components/HomeUploading"
import HomeUploadSent from "../components/HomeUploadSent"
import Panel from "../components/Panel"
import { MyContext } from "../components/Provider"
import Carousel from "../components/Carousel"
import { upload } from "./../utils/upload"

/*
 * The state of this class is maintained using "Context" APi
 * "Provider.js" only contains the state of this class
 * */
class Home extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      makePanelVisible: false,
      files: [],
    }
  }

  //  switching the components
  renderComponent = () => {
    const myContext = this.context
    const { componentToRender, userEmail, uploadEvent } = myContext.getState()

    // console.info("componentToRender ==> ", componentToRender)

    switch (componentToRender) {
      case "HomeUploading":
        return (
          <HomeUploading
            uploadEvent={uploadEvent}
            onCancel={() => {
              myContext.updateState({
                componentToRender: "HomeForm",
                uploadEvent: {
                  type: null,
                  payload: null,
                  cancelSource: null,
                },
              })
            }}
            changeComponent={componentToRender => {
              myContext.updateState({
                componentToRender,
              })
            }}
          />
        )
      case "HomeUploadSent":
        return (
          <HomeUploadSent
            onSendAnotherFile={() => {
              myContext.updateState({
                componentToRender: "HomeForm",
              })
            }}
            data={uploadEvent.payload}
            changeComponent={componentToRender => {
              myContext.updateState({
                componentToRender,
              })
            }}
          />
        )

      case "Authentication":
        return (
          <Authentication
            changeComponent={componentToRender => {
              myContext.updateState({
                componentToRender,
              })
            }}
          />
        )

      case "HomeForm":
        return (
          <HomeForm
            onUploading={(form, files) => {
              this.triggerUploading(form, files)
            }}
            changeComponent={componentToRender => {
              myContext.updateState({
                componentToRender,
              })
            }}
            userEmail={userEmail}
            showPanel={makePanelVisible => {
              this.setState({
                makePanelVisible,
              })
            }}
            updateFiles={files => {
              this.setState({
                files,
              })
            }}
            files={this.state.files}
            cancel={filename => {
              this.cancel(filename)
            }}
          />
        )
    }
  }

  triggerUploading = (form, files) => {
    const myContext = this.context

    /*  this would be called multiple times on a slow network
     */
    upload(form, files, event => {
      const { type, payload, cancelSource } = event

      //  @see upload.js
      const componentToRender =
        type === "success" ? "HomeUploadSent" : "HomeUploading"
      let data = type === "success" ? payload.data : payload

      // console.info("HomeForm", "data => ", data)

      const uploadEvent = {
        type,
        payload: data,
        cancelSource,
      }

      myContext.updateState({
        componentToRender,
        uploadEvent,
      })
    })
  }

  // remove files from state
  cancel = nameOfFile => {
    const files = this.state.files

    files.forEach((file, index) => {
      if (file.name === nameOfFile) {
        return files.splice(index, 1)
      }
    })

    this.setState({
      files,
    })
  }

  closePanel = () => {
    this.setState({
      showPanel: false,
    })
  }

  render() {
    const { makePanelVisible } = this.state

    return (
      <div className={"home-container container"}>
        <div className="main-box row">
          {/* LEFT PART  */}
          <div className="home-left-container d-none d-lg-block col-6 pl-0 pr-0">
            <Carousel />
          </div>

          {/* RIGHT PART ( this changes based on values in Provider.js ) */}
          <div className="home-right-container col col-lg-6">
            <div className="home-right-component">{this.renderComponent()}</div>
          </div>

          {/* MORE FILES PANEL */}
          {makePanelVisible === true ? (
            <Panel
              showPanel={makePanelVisible => {
                this.setState({
                  makePanelVisible,
                })
              }}
              files={this.state.files}
              cancel={fileName => {
                this.cancel(fileName)
              }}
            />
          ) : null}
        </div>
      </div>
    )
  }
}

export default Home

Home.contextType = MyContext
