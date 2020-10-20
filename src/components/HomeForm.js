import React, { Component } from "react"
import classnames from "classnames"
import { LinearProgress } from "@material-ui/core"
import Dropzone from "react-dropzone"
import { IconContext } from "react-icons"
import { Alert, AlertTitle } from "@material-ui/lab"
import { GiFiles } from "react-icons/gi"

import { MyContext } from "./Provider"

class HomeForm extends Component {
  static contextType = MyContext

  constructor(props, context) {
    super(props, context)
    this.ref = React.createRef()

    // console.info("props", props)

    this.state = {
      form: {
        from: "",
        to: "",
        message: "",
      },
      error: {
        isNull: null,
        isValid: null,
      },
      showProgressBar: false,
      fileSizeExceeded: false,
      filesSent: false
    }
  }

  render() {
    const files = this.props.files
    const { showProgressBar, fileSizeExceeded, filesSent } = this.state

    return (
      <div className="home-form-container">
        <div className="home-form-card card">
          {/*using DragAndDrop component here*/}
          <Dropzone onDrop={this.onFilesAdded}>
            {({ getRootProps, getInputProps }) => (
              <section
                className={
                  this.state.error.isNull === null || files.length !== 0
                    ? "dropzone__section d-block border-warning"
                    : "dropzone__section d-block border border-danger"
                }
                style={
                  files.length !== 0 || fileSizeExceeded
                    ? {
                        height: "10vh",
                      }
                    : {
                        height: "20vh",
                      }
                }
              >
                <div className="dropzone__main" {...getRootProps()}>
                  <input {...getInputProps()} />
                  <div
                    className="dropzone__text"
                    style={
                      files.length !== 0 || fileSizeExceeded
                        ? {
                            top: "0",
                            left: "5%",
                          }
                        : {
                            top: "0",
                            left: "20%",
                          }
                    }
                  >
                    Drag and drop files here
                  </div>
                  <div
                    className="dropzone__icon"
                    style={
                      files.length !== 0 || fileSizeExceeded
                        ? {
                            left: "90%",
                            top: "0",
                          }
                        : {
                            left: "40%",
                            top: "30%",
                          }
                    }
                  >
                    <IconContext.Provider
                      value={{
                        color: this.state.color,
                        className: "global-class-name",
                        size:
                          files.length !== 0 || fileSizeExceeded
                            ? "3rem"
                            : "5rem",
                      }}
                    >
                      <GiFiles />
                    </IconContext.Provider>
                  </div>
                </div>
              </section>
            )}
          </Dropzone>

          {/* error label */}
          {fileSizeExceeded ? (
            <Alert severity="error">
              Files should be under 25Mbs — <strong>try again...</strong>
            </Alert>
          ) : null}

          {/* Linear Progress Bar */}
          {showProgressBar ? <LinearProgress color="secondary" /> : null}

          {/* displaying the names of files selected
          showing "chip__more-files" when files > 3*/}
          <div className="chips__and__form d-flex flex-column">
            {files.length !== 0 ? (
              <div className="file-container d-flex flex-wrap mb-auto">
                {files.map((file, index) => {
                  if (index < 3)
                    return (
                      <div
                        className="chip d-inline-flex align-items-center mb-1"
                        key={file.name}
                      >
                        <div className="chip__filename">{file.name}</div>
                        <div
                          className="closebtn align-self-baseline"
                          onClick={this.onCancel.bind(this, file.name)}
                        >
                          &times;
                        </div>
                      </div>
                    )
                })}
                {files.length > 3 ? (
                  <div className="chip chip__more-files d-inline-flex align-items-center mb-1">
                    <div className="chip__filename" onClick={this.showPanel}>
                      +{files.length - 3} files
                    </div>
                  </div>
                ) : null}

                <div className="file-container__separator mb-1 mt-1"></div>
                
              </div>
            ) : null}

            {/* FORM */}
            <div className="form__container mt-auto">
              <form
                className={"d-flex flex-column ml-5 mr-5"}
                onSubmit={this.onSubmit}
              >
                <div
                  className={classnames("form-group", {
                    error:
                      this.state.error.isNull === true ||
                      this.state.error.isValid === false,
                  })}
                >
                  <label htmlFor="receiversEmailID">Send To</label>
                  <input
                    type="email"
                    className={
                      this.state.error.isNull !== null &&
                      (this.state.error.isNull === true ||
                        this.state.error.isValid === false)
                        ? "form-control border border-danger"
                        : "form-control"
                    }
                    id="receiversEmailID"
                    defaultValue={this.state.form.to}
                    aria-describedby="emailHelp"
                    placeholder="Enter email"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="messageTextAreaID">Message</label>
                  <textarea
                    className="form-control"
                    id="messageTextAreaID"
                    defaultValue={this.state.form.message}
                    placeholder="Enter Message(Optional)"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-block mt-auto mb-2"
                  disabled={fileSizeExceeded || filesSent ? true : false}
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  static getDerivedStateFromProps(props, state) {
    const files = props.files
    const fileSizeExceeded = HomeForm.checkFileSizeExceeded(files)
    return {
      ...state,
      fileSizeExceeded,
    }
  }

  //  cancel method for removing the items added in drag and drop
  onCancel = (fileName) => {
    this.props.cancel(fileName)
  }

  //  on form submission
  onSubmit = (e) => {
    e.preventDefault()
    this.formValidation(e)
  }

  //  validating the input fields
  formValidation = (e) => {
    e.preventDefault()

    let fields = {
      form: {
        from: "",
        to: "",
        message: "",
      },
      error: {
        isNull: true,
        isValid: false,
      },
    }

    //  regex to test the emails
    let regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    let { isNull, isValid } = fields.error
    let { from, to, message } = fields.form

    //  getting values from the inputs
    const receiversEmail = document.getElementById("receiversEmailID").value
    const sendersEmail = this.props.userEmail
    const messageInput = document.getElementById("messageTextAreaID").value

    //  logic for validation
    if (receiversEmail.length === 0 && sendersEmail.length === 0) {
      isNull = true
      isValid = false
      // console.log('Addresses are null')
    } else if (receiversEmail.length !== 0 && sendersEmail.length !== 0) {
      isNull = false

      //  validating the emails of receiver's and sender's
      const receiversEmailValid = regexEmail.test(receiversEmail)
      const sendersEmailValid = regexEmail.test(sendersEmail)

      isValid = receiversEmailValid && sendersEmailValid
      // console.log(`isValid ==> ${isValid}`)

      if (isValid && !isNull) {
        from = sendersEmail
        to = receiversEmail
        message = messageInput
      }
    }

    //  updating "fields"
    fields.form.from = from
    fields.form.to = to
    fields.form.message = message
    fields.error.isNull = isNull
    fields.error.isValid = isValid

    //  updating the state
    //  files to pe passed in upload()
    const files = this.props.files
    
    this.setState(
      (prevState) => {
        return {
          ...prevState,
          ...fields,
        }
      },
      () => {
        /*console.log(`Inside callback after the state is updated ==> `, this.state)*/

        //  if isNUll === true or isValid === false or props.files.length === 0 then returning
        //  and the respective components will turn red as the classnames would get changed
        if (
          this.state.error.isNull ||
          !this.state.error.isValid ||
          files.length === 0
        )
          return

        //  this will trigger "upload" method in "Home"
        this.setState(
          {
            showProgressBar: true,
            filesSent: true
          },
          () => {
            //  delay added to show the progress bar
            setTimeout(() => {
              this.props.onUploading(this.state.form, files)
            }, 1500)
          }
        )
      }
    )
  }

  //  getting previous files from the state in Home.js, adding it with the new files
  onFilesAdded = (filesArray) => {
    let { fileSizeExceeded } = this.state

    const classContext = this

    const prevFiles = this.props.files
    let finalFiles = null
    if (prevFiles.length !== 0) finalFiles = [...prevFiles, ...filesArray]
    else finalFiles = filesArray

    // console.info("final files array", finalFiles)

    const totalSizeInMbs = HomeForm.checkFileSizeExceeded(finalFiles)
    totalSizeInMbs > 25 ? (fileSizeExceeded = true) : (fileSizeExceeded = false)

    this.setState(
      {
        fileSizeExceeded,
      },
      () => {
        classContext.props.updateFiles(finalFiles)
      }
    )
  }

  static checkFileSizeExceeded = (finalFiles) => {
    let totalSize = 0
    finalFiles.forEach((file) => {
      totalSize += file.size
    })

    return Math.ceil(totalSize / (1024 * 1024)) > 25 ? true : false
  }

  showPanel = () => {
    this.props.showPanel(true)
  }

  // componentDidCatch(error, errorInfo) {
  //   const FUNC_TAG = "componentDidCatch"
  //   console.info(FUNC_TAG, "error: ", error, "error info", errorInfo)
  // }

  // componentWillUnmount() {
  //   console.info("componentWillUnmount")
  // }
}

HomeForm.contextType = MyContext

export default HomeForm
