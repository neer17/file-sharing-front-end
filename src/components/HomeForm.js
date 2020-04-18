import React, { Component } from "react"
import classnames from "classnames"
import { reactLocalStorage } from "reactjs-localstorage"

import { MyContext } from "./Provider"
import { upload } from "../utils/upload"
import { element } from "prop-types"

class HomeForm extends Component {

  static contextType = MyContext

  constructor(props, context) {
    super(props, context)
    this.ref = React.createRef()

    this.state = {
      form: {
        from: this.context.getState().userEmail,
        to: "",
        message: "",
      },
      hasFiles: false,
      error: {
        isNull: null,
        isValid: null,
      },
    }
  }

 

  //  cancel method for removing the items added in drag and drop
  onCancel = (fileName) => {
    this.context.cancel(fileName)
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
    const sendersEmail = this.state.form.from
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
    const files = this.context.getState().files
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
        upload(this.state.form, files, (events) => {
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
  onFilesAdded = (e) => {
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

  showAllFiles = () => {
    this.context.updateState({
      showMoreFilesPanel: true,
    })
  }

  render() {
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
                onChange={this.onFilesAdded}
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
          <div className="form__container">
              <form className={"d-flex flex-column ml-5 mr-5"} onSubmit={this.onSubmit}>
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
                >
                  Send
                </button>
              </form>          
          </div>
        </div>
      </div>
    )
  }

  // componentDidCatch(error, errorInfo) {
  //   const FUNC_TAG = "componentDidCatch"
  //   console.info(FUNC_TAG, "error: ", error, "error info", errorInfo)
  // }
}

HomeForm.contextType = MyContext

export default HomeForm
