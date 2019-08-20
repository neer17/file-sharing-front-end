import React, {Component} from 'react'
import classnames from 'classnames'

import {upload} from '../helper/upload'
import './helper.css'

class HomeForm extends Component {
    state = {
        form: {
            from: '',
            to: '',
            message: ''
        },
        files: {
            values: [],
            hasFiles: null
        },
        error: {
            isNull: null,
            isValid: null
        }
    }

    //  cancel method for removing the items added in drag and drop
    onCancel = (nameOfFile) => {
        //  getting the name of the file and then removing it from the values and finally
        //  updating the state with new "values"
        let {files} = this.state
        const values = files.values

        values.forEach((value, index) => {
            if (value.name === nameOfFile) {
                return values.splice(index, 1)
            }
        })

        this.setState({
            files: {
                hasFiles: true,
                values
            }
        })

    }

    render() {
        // console.log('home-form.js render state ==> ', this.state)

        return (
            <div className={"col col-md-6"}>
                <div className="card" style={{width: "50"}}>
                    {/*
                     * displaying the names of files selected
                     */}
                    {this.state.files.values.length === 0 ? null :
                        <div>
                            {
                                this.state.files.values.map((file) => {
                                    // console.log('home-form.js render file ==> ', file)

                                    return (
                                        <div className={"d-flex m-2"} key={file.name}>
                                            <div className={"flex-grow-1 border-bottom p-1"}
                                            >
                                                {file.name}
                                            </div>
                                            {/*Cancel button of each file*/}
                                            <div className={"btn btn-light"}
                                                 onClick={this.onCancel.bind(this, file.name)}>x
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }

                    <div className="card-header
                                d-flex flex-fill
                                    justify-content-center align-items-center">
                        {/*using DragAndDrop component here*/}
                        <label
                            className={
                                (this.state.error.isNull === null || this.state.files.hasFiles)
                                    ? "border-warning"
                                    : "d-flex border border-danger"
                            }
                            style={{
                                width: 500,
                                height: 100,
                            }}>
                            <input id={"multipleInputId"}
                                   type="file" multiple={true}
                                   onChange={this._onFilesAdded}
                                   style={{
                                       position: "fixed",
                                       display: "none"
                                   }}/>
                            <div style={{
                                "textAlign": "center",
                                "fontSize": 20
                            }}>Drag and drop files here
                            </div>
                            <div className={"d-flex align-items-center justify-content-center"} style={{
                                height: 100
                            }}>
                                <i className="far fa-images" style={{
                                    "fontSize": 50,
                                    "textAlign": "center"
                                }}/>
                            </div>
                        </label>
                    </div>
                    <div>
                    </div>
                    <ul className="list-group list-group-flush">
                        <form className={"ml-5 mr-5"}>
                            <div
                                className={classnames("form-group", {"error": (this.state.error.isNull === true || this.state.error.isValid === false)})}>
                                <label htmlFor="receiversEmailID">Send To</label>
                                <input type="email"
                                       className={
                                           (this.state.error.isNull !== null) &&
                                           (this.state.error.isNull === true || this.state.error.isValid === false)
                                               ? "form-control border border-danger"
                                               : "form-control"
                                       }
                                       id="receiversEmailID"
                                       defaultValue={this.state.form.to}
                                       aria-describedby="emailHelp" placeholder="Enter email"/>
                            </div>
                            <div
                                className={classnames("form-group", {"error": (this.state.error.isNull === true || this.state.error.isValid === false)})}>
                                <label htmlFor="sendersEmailID">Your Email</label>
                                <input type="email"
                                       className={
                                           (this.state.error.isNull !== null) &&
                                           (this.state.error.isNull === true || this.state.error.isValid === false)
                                               ? "form-control border border-danger"
                                               : "form-control"
                                       }
                                       id="sendersEmailID"
                                       defaultValue={this.state.form.from}
                                       placeholder="Your Email Address"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="messageTextAreaID">Message</label>
                                <textarea className="form-control" id="messageTextAreaID"
                                          defaultValue={this.state.form.message}
                                          placeholder="Enter Message(Optional)"/>
                            </div>
                            <button type="submit"
                                    className="btn btn-primary btn-block mb-5"
                                    onClick={this._onSubmit}
                            >Submit
                            </button>
                        </form>
                    </ul>
                </div>
            </div>
        )
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
                from: '',
                to: '',
                message: ''
            },
            error: {
                isNull: true,
                isValid: false,
            }
        }

        //  regex to test the emails
        let regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        let {isNull, isValid} = fields.error
        let {from, to, message} = fields.form

        //  getting values from the inputs
        const receiversEmail = document.getElementById('receiversEmailID').value
        const sendersEmail = document.getElementById('sendersEmailID').value
        const messageInput = document.getElementById('messageTextAreaID').value

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

            isValid = (receiversEmailValid && sendersEmailValid)
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
        this.setState((prevState) => {
            return {
                ...prevState,
                ...fields
            }
        }, () => {
            /*console.log(`Inside callback after the state is updated ==> `, this.state)*/

            //  if isNUll == true or isValid == false or hasFiles == false then returning
            //  and the respective components will turn red as the classnames would get changed
            if (this.state.error.isNull || !this.state.error.isValid || !this.state.files.hasFiles)
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
        })
    }

    //  this would be called when files are added
    _onFilesAdded = (e) => {
        const filesObject = e.target.files
        const filesArray = Object.values(filesObject)

        //  updating the state
        this.setState((prevState) => {
            //  changing "hasFiles" to true and adding the files
            const files = prevState.files
            files.hasFiles = true
            files.values = filesArray

            return {
                ...prevState,
                files
            }
        }, () => {
            // console.log('State after adding files ==> ', this.state)
        })
    }
}

export default HomeForm