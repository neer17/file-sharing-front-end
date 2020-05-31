import React, { Component } from "react"
import { FaRegFilePdf, FaImage } from "react-icons/fa"
import { TiDocumentText } from "react-icons/ti"
import { IconContext } from "react-icons"

import { IMAGE_SIZE } from "./../utils/constants"

// rendered in home.js
//  controlled from home-form.js
class Panel extends Component {
  constructor(props) {
  super(props)

    this.state = {
      files: null
    }

    this.ref = React.createRef()
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.hidePanel)
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.hidePanel)
  }

  hidePanel = (event) => {
    if (this.ref && !this.ref.current.contains(event.target))
      this.closePanel()
  }

  onCancel = (fileName) => {
    this.props.cancel(fileName)
  }

  closePanel = () => {
    this.props.showPanel(false)
  }

  findFileType = (fileType) => {
    switch (fileType) {
      case "image/jpeg":
      case "image/jpg":
        return (
          <IconContext.Provider
            value={{
              color: "blue",
              className: "global-class-name",
              size: IMAGE_SIZE,
            }}
          >
            <FaImage />
          </IconContext.Provider>
        )
      case "application/pdf":
        return (
          <IconContext.Provider
            value={{
              color: "blue",
              className: "global-class-name",
              size: IMAGE_SIZE,
            }}
          >
            <FaRegFilePdf />
          </IconContext.Provider>
        )
      default:
        return (
          <IconContext.Provider
            value={{
              color: "blue",
              className: "global-class-name",
              size: IMAGE_SIZE,
            }}
          >
            <TiDocumentText />
          </IconContext.Provider>
        )
    }
  }

  render() {
    const files = this.props.files

    return (
      <div className="panel container" ref={this.ref}>
        <div className="panel__cross-btn" onClick={this.closePanel}>
          &times;
        </div>

        {files.length > 0 ? (
          <div>
            {files.map((file) => {
              return (
                <div
                  className="panel__container d-flex p-2"
                  key={file.name + `${new Date().getTime()}`}
                >
                  <div className="panel__img align-self-center p-1 mr-4">
                    {this.findFileType(file.type)}
                  </div>
                  <div className="panel__filename flex-grow-1 p-1">
                    {file.name}
                  </div>
                  <div
                    className="panel__close-button p-1"
                    onClick={this.onCancel.bind(this, file.name)}
                  >
                    &times;
                  </div>
                </div>
              )
            })}
          </div>
        ) : null}
      </div>
    )
  }
}

export default Panel
