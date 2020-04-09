import React, { Component } from "react"
import classnames from "classnames"
import { reactLocalStorage } from "reactjs-localstorage"

import { MyContext } from "./Provider"
import { upload } from "../utils/upload"
import { element } from "prop-types"

class HomeForm extends Component {
  constructor(props) {
    super(props)
    this.ref = React.createRef()
  }

  state = {
    form: {
      from: "",
      to: "",
      message: "",
    },
    hasFiles: false,
    error: {
      isNull: null,
      isValid: null,
    },
  }

  //  cancel method for removing the items added in drag and drop
  onCancel = (fileName) => {
    this.context.cancel(fileName)
  }

  //  on form submission
  _onSubmit = (e) => {
    e.preventDefault()
    this._formValidation(e)
  }

  //  validating the input fields
  _formValidation = (e) => {
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
    const sendersEmail = document.getElementById("sendersEmailID").value
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
    this.setState(
      (prevState) => {
        return {
          ...prevState,
          ...fields,
        }
      },
      () => {
        /*console.log(`Inside callback after the state is updated ==> `, this.state)*/

        //  if isNUll == true or isValid == false or hasFiles == false then returning
        //  and the respective components will turn red as the classnames would get changed
        if (
          this.state.error.isNull ||
          !this.state.error.isValid ||
          !this.state.hasFiles
        )
          return

        //  if there is no error then calling upload method from "upload.js"
        //  to send the state to the backend
        upload(this.state, (events) => {
          //  information about the post that was uploaded fom the back-end
          // console.log('Inside upload events ==> ', events)

          /**
           * passing prop "onUploading" from "home.js"
           * checking it for null and then passing the events of the upload function
           */
          if (this.props.onUploading) {
            this.props.onUploading(events)
          }
        })
      }
    )
  }

  //  this would be called when files are added
  _onFilesAdded = (e) => {
    const filesObject = e.target.files
    const filesArray = Object.values(filesObject)

    //  getting previous files from the state in Provider.js, adding it with the new files
    const prevFiles = this.context.getState().files
    let finalFiles = null
    if (prevFiles.length !== 0) finalFiles = [...prevFiles, ...filesArray]
    else finalFiles = filesArray

    this.setState(
      {
        hasFiles: true,
      },
      () => {
        this.context.updateState({
          files: finalFiles,
        })
      }
    )
  }

  windUpChips = () => {
    console.info("windUpChips")
    this.isElementOverflown(document.getElementById("file-container"))
  }
  isElementOverflown = (element) => {
    // return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth
    console.info(
      "element width ==> ",
      element.scrollWidth,
      "\n",
      "client width ==> ",
      element.clientWidth
    )
  }

  showAllFiles = () => {
    this.context.updateState({
      showMoreFilesPanel: true,
    })
  }

  render() {
    console.info("render")
    // console.log('home-form.js render state ==> ', this.state)

    const files = this.context.getState().files

    return (
      <div className="home-form-container">
        <div className="home-form-card card">
          <div className="card-header">
            {/*using DragAndDrop component here*/}
            <label
              className={
                this.state.error.isNull === null || this.state.hasFiles
                  ? "d-block border-warning"
                  : "d-block border border-danger"
              }
              style={
                this.state.hasFiles === true
                  ? {
                      height: 40,
                      position: "relative",
                    }
                  : {
                      height: 80,
                      position: "relative",
                    }
              }
            >
              <input
                id={"multipleInputId"}
                type="file"
                multiple={true}
                onChange={this._onFilesAdded}
                style={{
                  position: "fixed",
                  display: "none",
                }}
              />
              <div
                style={
                  this.state.hasFiles === true
                    ? {
                        position: "absolute",
                        top: "0",
                        left: "0",
                        fontSize: 20,
                      }
                    : {
                        position: "absolute",
                        top: "0",
                        left: "20%",
                        fontSize: 20,
                      }
                }
              >
                Drag and drop files here
              </div>
              {/* <div
                className={"d-block text-center"}
                style={{
                  position: "absolute",
                  
                  // transform: 'translate(-50%, 50%)'
                }}
              > */}
              <i
                className="far fa-images"
                style={
                  this.state.hasFiles === true
                    ? {
                        fontSize: 20,
                        textAlign: "center",
                        position: "absolute",
                        left: "90%",
                        top: "0",
                        transition: "all .5s",
                      }
                    : {
                        position: "absolute",
                        fontSize: 50,
                        textAlign: "center",
                        left: "40%",
                        top: "50%",

                        transition: "all .5s",
                      }
                }
              />
            </label>
          </div>

          {/* displaying the names of files selected
          showing "chip__more-files" when files > 3*/}
          {this.state.hasFiles === true ? (
            <div className="file-container">
              {files.map((file, index) => {
                if (index < 3)
                  return (
                    <div
                      className="chip d-inline-flex align-items-center"
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
                <div className="chip chip__more-files d-inline-flex align-items-center">
                  <div className="chip__filename" onClick={this.showAllFiles}>
                    +{files.length - 3} files
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {/* FORM */}
          <div className="home-form__form">
            <ul className="list-group list-group-flush">
              <form className={"ml-5 mr-5"}>
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
                <div
                  className={classnames("form-group", {
                    error:
                      this.state.error.isNull === true ||
                      this.state.error.isValid === false,
                  })}
                >
                  <label htmlFor="sendersEmailID">Your Email</label>
                  <input
                    type="email"
                    className={
                      this.state.error.isNull !== null &&
                      (this.state.error.isNull === true ||
                        this.state.error.isValid === false)
                        ? "form-control border border-danger"
                        : "form-control"
                    }
                    id="sendersEmailID"
                    defaultValue={this.state.form.from}
                    placeholder="Your Email Address"
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
                  className="btn btn-primary btn-block"
                  onClick={this._onSubmit}
                >
                  Submit
                </button>
              </form>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

HomeForm.contextType = MyContext

export default HomeForm
