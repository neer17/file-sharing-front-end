import React, { Component } from "react"
import { IconContext } from "react-icons"
import { FiUpload } from "react-icons/fi"

import { betterNumber } from "../utils/betterNumber"

class HomeUploading extends Component {
  constructor(props) {
    super(props)
    const { uploadEvent } = props

    const currentLoaded = uploadEvent.payload.loaded
    const total = uploadEvent.payload.total

    this.state = {
      startTime: new Date().getTime(),
      currentLoaded,
      currentUploadSpeed: 0,
      total,
      percentage: 0,
    }
  }

  componentDidMount() {
    // console.info("componentDidMount")

    const {type, payload} = this.props.uploadEvent
    const currentTime = new Date().getTime()

    /*console.log('home-uploading \t type ==> ', type, 'payload ==> ', payload)
        console.log('state ==> ', this.state)*/

    /**
     *  on local server when the component renders for the first time then
     *  in the first render axios will finish sending the file to the server
     *  that is why only in the first render "onUploadProgress" is the type and then in the second render
     *  type will be "axios.post"
     *  However, on a real server this component can render multiple times unless axios sends the file completely
     *  So, switch condition should be present in both "componentDidMount" and "componentWillReceiveProps"
     */
    if (type === "onUploadProgress") {
      // console.log('onUploadProgress')

      const { loaded, total } = payload
      const elapsedTime = currentTime - this.state.startTime
      const diffInLoad = this.state.currentLoaded - loaded
      const currentUploadSpeedInBytes = diffInLoad / elapsedTime

      // console.log('diffInLoad ==> ', diffInLoad)
      // console.log('elapsed time ==> ', elapsedTime)
      // console.log('currentUploadSpeedInBytes ==> ', currentUploadSpeedInBytes)

      const percentage = total !== 0 ? (loaded / total) * 100 : 0
      return this.setState({
        startTime: currentTime,
        currentLoaded: loaded,
        currentUploadSpeed: currentUploadSpeedInBytes,
        total,
        percentage,
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    // console.log('-- componentWillReceiveProps --')

    const type = nextProps.type
    const payload = nextProps.payload
    const currentTime = new Date().getTime()

    /*console.log('home-uploading \t type ==> ', type, 'payload ==> ', payload)
        console.log('state ==> ', this.state)*/

    /**
     *  updating the state when the component re-renders
     *  updating "startTime", "currentLoaded" and "currentUploadSpeed" to calculate the speed
     *  on every render
     */
    if (type === "onUploadProgress") {
      // console.log('onUploadProgress')

      const { loaded, total } = payload
      const elapsedTime = currentTime - this.state.startTime
      const diffInLoad = this.state.currentLoaded - loaded
      const currentUploadSpeedInBytes = diffInLoad / elapsedTime

      console.log("currentUploadSpeedInBytes ==> ", currentUploadSpeedInBytes)

      const percentage = total !== 0 ? (loaded / total) * 100 : 0
      return this.setState({
        startTime: currentTime,
        currentLoaded: loaded,
        currentUploadSpeed: currentUploadSpeedInBytes,
        total,
        percentage,
      })
    }
  }

  render() {
    const { currentLoaded, total, percentage, currentUploadSpeed } = this.state
    const loadedFormat = betterNumber(currentLoaded, true)
    const totalFormat = betterNumber(total, true)
    const uploadSpeed = betterNumber(currentUploadSpeed, true) + "/s"

    /*console.log(`percentage ==> ${percentage}`)
        console.log('upload speed ==> ', betterNumber(currentUploadSpeed, true) + '/s')*/

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
                  onClick={() => {
                    //  passing this function as a prop
                    if (this.props.onCancel) {
                      this.props.onCancel()
                    }
                  }}
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
