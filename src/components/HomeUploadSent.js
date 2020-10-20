import React, { Component } from "react"
import PropTypes from "prop-types"

import Icon from "./Icon"
import history from "../utils/history"

class HomeUploadSent extends Component {
  render() {
    const objectId = this.props.data.file[0]._id
    const toEmail = this.props.data.file[0].to
    
    return (
      <div className={"app-card app-card-upload-sent"}>
        <div className={"app-card-content"}>
          <div className={"app-card-content-inner"}>
            <div className={"app-home-uploading"}>
              <div className={"app-home-upload-sent-icon"}>
                <Icon size={"10rem"} />
              </div>
              <div className={"app-upload-sent-message app-text-center"}>
                <h2>Files sent!</h2>
                <p>
                  You have sent an email to {toEmail} with a download link. The
                  link will expire in 30 days.
                </p>
              </div>
              <div className={"app-upload-sent-actions app-form-actions"}>
                <button
                  onClick={() => {
                    //  re-directing to the "localhost:3001/share/:id"
                    history.push(`/share/${objectId}`)
                  }}
                  className={"app-button primary"}
                  type={"button"}
                >
                  View file
                </button>
                <button
                  onClick={() => {
                    if (this.props.onSendAnotherFile) {
                      this.props.onSendAnotherFile()
                    }
                  }}
                  className={"app-button"}
                  type={"button"}
                >
                  Send another file
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

HomeUploadSent.propTypes = {
  data: PropTypes.object,
  onSendAnotherFile: PropTypes.func,
}
export default HomeUploadSent
