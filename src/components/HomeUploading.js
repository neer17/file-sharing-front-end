import React, { Component } from "react"
import { IconContext } from "react-icons"
import { FiUpload } from "react-icons/fi"

import {source} from "./../utils/upload"
import { betterNumber } from "../utils/betterNumber"

class HomeUploading extends Component {
  constructor(props) {
    super(props)

    this.startTime = new Date().getTime()
    this.currentLoaded = this.props.uploadEvent.payload.loaded
  }

  computeValues = () => {
    const currentTime = new Date().getTime()
    const { loaded, total } = this.props.uploadEvent.payload
    const elapsedTime = currentTime - this.startTime
    const diffInLoad = loaded - this.currentLoaded
    const currentUploadSpeed = (diffInLoad / elapsedTime) * 1000
    const percentage = total !== 0 ? (loaded / total) * 100 : 0

    const returnObject = {
      currentLoaded: this.currentLoaded,
      percentage,
      currentUploadSpeed,
    }
    //  updating values
    this.currentLoaded = loaded
    this.startTime = currentTime

    return returnObject
  }

  cancelRequest = () => {
    source.cancel('Operation cancelled by the user')
  }

  render() {
    const total = this.props.uploadEvent.payload.total
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
                <IconContext.Provider
                  value={{
                    color: "blue",
                    className: "global-class-name",
                    size: "5rem",
                  }}
                >
                  <FiUpload />
                </IconContext.Provider>
                <div>Sending...</div>
              </div>

              <div className={"app-upload-files-total"}>Uploading files.</div>

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
                <div className={"app-upload-stats-right"}>{uploadSpeed}</div>
              </div>

              <div className={"app-form-actions"}>
                <button
                  className={"app-upload-cancel-button app-button"}
                  type={"button"}
                  onClick={this.cancelRequest}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default HomeUploading
