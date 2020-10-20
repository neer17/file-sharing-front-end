import React, { Component } from "react"
import { Alert, AlertTitle } from "@material-ui/lab"

import Icon from "./Icon"
import { MyContext } from "./Provider"
import { betterNumber } from "../utils/betterNumber"

class HomeUploading extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isOperationCancelled: false,
    }

    this.uploadEvent = this.props.uploadEvent ? this.props.uploadEvent : null

    this.startTime = new Date().getTime()
    this.currentLoaded = this.uploadEvent.payload.loaded
    this.currentUploadSpeed = 0
  }

  computeValues = () => {
    const currentTime = new Date().getTime()
    const { loaded, total } = this.uploadEvent.payload
    const elapsedTime = currentTime - this.startTime
    const diffInLoad = loaded - this.currentLoaded
    this.currentUploadSpeed = (diffInLoad / elapsedTime) * 1000
    const percentage = total !== 0 ? (loaded / total) * 100 : 0

    const returnObject = {
      currentLoaded: this.currentLoaded,
      percentage,
      currentUploadSpeed: this.currentUploadSpeed,
    }
    //  updating values
    this.currentLoaded = loaded
    this.startTime = currentTime

    return returnObject
  }

  cancelRequest = () => {
    this.uploadEvent.cancelSource.cancel(
      "Operation cancelled by the user"
    )

    this.setState({
      isOperationCancelled: true,
    })
  }

  navigateBackToHome = () => {
    this.props.changeComponent("HomeForm")
  }

  render() {
    const total = this.uploadEvent.payload.total

    const {
      currentLoaded,
      percentage,
      currentUploadSpeed,
    } = this.computeValues()

    const loadedFormat = betterNumber(currentLoaded, true)
    const totalFormat = betterNumber(total, true)
    const uploadSpeed = betterNumber(currentUploadSpeed, true) + "/s"

    return (
      <div className={"app-card app-card-uploading"}>
        <div className={"app-card-content"}>
          <div className={"app-card-content-inner"}>
            <div className={"app-home-uploading"}>
              <div className={"app-home-uploading-icon"}>
                <div className={"app-home-upload-sent-icon"}>
                  <Icon size={"10rem"} />
                </div>
                <div className="app-card__uploading-title">
                  Uploading files...
                </div>
              </div>

              {this.state.isOperationCancelled ? (
                <Alert severity="error">
                  <AlertTitle>Error</AlertTitle>
                  All files have been cancelled — <strong>oops...</strong>
                </Alert>
              ) : (
                <div className="app-card__progress-card">
                  <div className={"app-upload-files-total"}>Progress</div>

                  <div className={"app-progress"}>
                    <span
                      style={{ width: `${percentage}%` }}
                      className={"app-progress-bar"}
                    />
                  </div>

                  <div className={"app-upload-stats"}>
                    <div className={"app-upload-stats-left"}>
                      {loadedFormat}/{totalFormat}
                    </div>
                    <div className={"app-upload-stats-right"}>
                      {uploadSpeed}
                    </div>
                  </div>
                </div>
              )}

              <div className={"app-form-actions"}>
                {this.state.isOperationCancelled ? (
                  <button
                    className={"app-upload-cancel-button app-button"}
                    onClick={this.navigateBackToHome}
                  >
                    Go back to Home
                  </button>
                ) : (
                  <button
                    className={"app-upload-cancel-button app-button"}
                    type={"button"}
                    onClick={this.cancelRequest}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // componentDidMount() {
  //   console.info('componentDidMount')
  // }

  // componentWillUnmount() {
  //   console.info('componentWillUnmount')
  // }
}

HomeUploading.contextType = MyContext

export default HomeUploading
