import React, { Component } from "react"
import _ from "lodash"
import { CircularProgress } from "@material-ui/core"
import {
  WhatsappShareButton,
  LinkedinShareButton,
  FacebookShareButton,
  TwitterShareButton,
  WhatsappIcon,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
} from "react-share"

import Icon from "../components/Icon"
import { postDownload } from "../utils/postDownload"
import { url } from "../utils/domainConfig"
import { betterNumber } from "../utils/betterNumber"
import history from "./../utils/history"

class ViewFile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      post: null,
      showProgressBar: true,
    }

    this.getTotalDownloadSize = this.getTotalDownloadSize.bind(this)
  }

  /**
   * We'll have access to props because of the "history" package
   */
  componentDidMount() {
    const { match } = this.props

    const postId = _.get(match, "params.id")

    //  this will make a request to the server, which would get all the details of the file and
    //  then in the response we would be having access to those details

    /**
     * this method won't wait for the below async function to finish the call, instead it would call render while
     * async function runs on some other thread
     * So, get a default value null or empty array to keep the app from crashing, it can be done easily using lodash
     * and then in the next render when async function gives the result the state would change and a re-render would happen
     * and then every thing would run fine
     */
    postDownload(postId)
      .then((response) => {
        this.setState(
          {
            post: _.get(response, "data"),
            showProgressBar: false,
          },
          () => {}
        )
      })
      .catch((err) => {
        console.log("an error fetching download data", err) // we can redirect user to not found page later
      })
  }

  getTotalDownloadSize() {
    const { post } = this.state

    let total = 0
    const filesIds = _.get(post, "files", [])

    _.each(filesIds, (fileId) => {
      total += _.get(fileId, "size", 0)
    })

    return betterNumber(total, true)
  }

  render() {
    const { post, showProgressBar } = this.state
    const files = _.get(post, "files", [])
    const totalSize = this.getTotalDownloadSize()
    const postId = _.get(post, "_id", null)

    return (
      <div className={"main-box row"}>
        <div className={"col"}>
          <div className={"main-box__container d-flex flex-column"}>
            <div className={"app-download-icon align-self-center mt-3"}>
              <Icon size={"5rem"} />
            </div>

            <div className="app-card-heading h2">Ready to download</div>
            <div
              className={
                "app-download-message app-text-center d-flex justify-content-center"
              }
            >
              <div className="p-2">{files.length} files</div>
              <div className="p-2">{totalSize}</div>
              <div className="p-2">Expires in 30 days</div>
            </div>

            <div className={"app-download-file-list flex-grow-1"}>
              <div className="progress-bar">
                {showProgressBar ? (
                  <CircularProgress color="secondary" />
                ) : null}
              </div>

              {files.map((file, index) => {
                return (
                  <div key={index} className={"app-download-file-list-item"}>
                    <div className={"filename"}>
                      {_.get(file, "originalname")}
                    </div>
                    <div className={"download-action"}>
                      {/* url to backend route */}
                      <a href={`${url}/download/${_.get(file, "_id")}`}>
                        Download
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className={"mt-auto app-download-actions "}>
              <a
                href={`${url}/downloadAllFiles/${postId}`}
                className="btn btn-primary btn-block"
              >
                Download All
              </a>
              <div className="share-buttons d-flex justify-content-center align-items-center mt-4 mb-2">
                <span className="p-2">
                  <WhatsappShareButton
                    url={`${url}/downloadAllFiles/${postId}`}
                  >
                    <WhatsappIcon size={32} round={true} />
                  </WhatsappShareButton>
                </span>

                <span className="p-2">
                  <FacebookShareButton
                    url={`${url}/downloadAllFiles/${postId}`}
                  >
                    <FacebookIcon size={32} round={true} />
                  </FacebookShareButton>
                </span>

                <span className="p-2">
                  <TwitterShareButton url={`${url}/downloadAllFiles/${postId}`}>
                    <TwitterIcon size={32} round={true} />
                  </TwitterShareButton>
                </span>

                <span className="p-2">
                  <LinkedinShareButton url={`${url}/downloadAllFiles/${postId}`}>
                    <LinkedinIcon size={32} round={true} />
                  </LinkedinShareButton>
                </span>

              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ViewFile
