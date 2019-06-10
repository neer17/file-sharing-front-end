import React, {Component} from 'react'
import Classnames from 'classnames'

import CreateUser from './../helper/createUser'
import {MyContext} from './Provider'

class LoginForm extends Component {
    state = {
        isLogin: true,
        user: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        error: {
            name: null,
            email: null,
            password: null,
            confirmPassword: null
        },
        message: {
            type: null,
            message: null
        }
    }

    constructor(props) {
        super(props)
        this.onTextFieldChange = this.onTextFieldChange.bind(this)
        this.onSubmitForm = this.onSubmitForm.bind(this)
    }

    onTextFieldChange(e) {

        let {user} = this.state
        const fieldName = e.target.name
        user[fieldName] = e.target.value

        this.setState({
            user
        })
    }

    //  submitting the form after getting the callback from @see "formValidation" method
    onSubmitForm(e) {
        console.log('onSubmitForm')

        e.preventDefault()

        const {isLogin} = this.state

        let fieldsToValidate = ['email', 'password']

        /**
         * if @params isLogin false then adding more fields to "fieldsToValidate"
         * */
        if (!isLogin) {
            fieldsToValidate = [...fieldsToValidate, 'confirmPassword', 'name']
        }

        this.formValidation(fieldsToValidate, (isValid) => {
            if (isValid) {
                if (isLogin) {
                    console.info('isLogin ==> ', isLogin)
                    /**
                     * logging in the user and getting the response back from the BACK-END, and then updating the state
                     * */
                    const user = new CreateUser(this.state.user)
                    user.signInUser().then((response) => {
                        console.info('login.js signInUser response ==> ', response)

                        //  storing the id and token of the logged-in user in the local storage
                        localStorage.setItem("token", response.data.token)
                        localStorage.setItem("userId", response.data.userId)

                        const message = {
                            type: 'success',
                            message: response.data.message
                        }
                        this.setState({
                            message
                        }, () => {
                            //  Calling after a timeout so that the message is displayed on the page
                            setTimeout(() => {
                                /**
                                 * calling the props so that "isAuthenticated " in "App.js" is updated
                                 */
                                this.props.onSignupOrlogin()

                                /*
                                * updating the state in Provider.js
                                * */
                                this.context.updateState({
                                    isAuthenticated: true,
                                    componentToRender: 'HomeForm'
                                })
                            }, 3 * 1000)

                        })

                    }).catch(err => {
                        const statusCode = err.response.status

                        //  it is sent from the backend
                        if (statusCode === 403) {
                            const message = {
                                type: 'error',
                                message: err.response.data.message
                            }

                            this.setState({
                                message
                            })
                        } else {
                            console.log(err)
                        }
                    })
                } else {
                    console.info('isLogin ==> ', isLogin)
                    /**
                     * Creating a new user and getting the response back from theBACK-END and then updating the state
                     * */
                    let newUser = new CreateUser(this.state.user)
                    newUser.createUserUsingAxios().then((response) => {
                        console.info('login.js signUpUser response ==> ', response)

                        //  dont get confused with type = error, it is just changing the color of the div that is used ot display the message
                        //  do refactor it
                        const message = {
                            type: 'success',
                            message: response.data.message
                        }

                        this.setState({
                            message
                        }, () => {
                            setTimeout(() => {
                                //  calling the props so that "isAuthenticated " in "App.js" is updated
                                this.props.onSignupOrlogin()

                                /*
                                * updating the state in Provider.js
                                * */
                                this.context.updateState({
                                    isAuthenticated: true,
                                    componentToRender: 'HomeForm'
                                })
                            }, 3 * 1000)

                        })
                    }).catch(err => {
                        const statusCode = err.response.status

                        //  it is sent from the backend
                        if (statusCode === 403) {
                            const message = {
                                type: 'error',
                                message: err.response.data.message
                            }

                            this.setState({
                                message
                            })
                        } else {
                            console.log(err)
                        }
                    })
                }
            }
        })
    }

    /**
     * Validating the form
     * */
    formValidation(fieldsToValidate = [], callback = () => {
    }) {
        let {user, error, isLogin} = this.state

        let allFields = {
            name: {
                message: 'Name is required',
                doValidate: () => {
                    let trimmedName = user.name.trim()
                    if (trimmedName.length === 0) return false
                }
            },
            email: {
                message: 'Email is required',
                doValidate: () => {
                    let trimmedEmail = user.email.trim()
                    if (trimmedEmail.length === 0) return false
                }
            },
            password: {
                message: 'Password is required',
                doValidate: () => {
                    let trimmedPassword = user.password.trim()
                    if (trimmedPassword.length === 0) return false
                }
            },
            confirmPassword: {
                message: 'Confirm your password',
                doValidate: () => {
                    let trimmedPassword = user.confirmPassword.trim()
                    return trimmedPassword.length !== 0

                }
            }
        }

        fieldsToValidate.forEach((value) => {
            let fieldValue = allFields[value]
            let isFieldValid = fieldValue.doValidate()

            if (isFieldValid === false) {
                error = {
                    ...error,
                    [value]: fieldValue.message
                }
            } else {
                error = {
                    ...error,
                    [value]: null
                }
            }
        })

        //  validating values of password and confirmPassword fields
        if (!isLogin) {
            const password = user.password
            const confirmPassword = user.confirmPassword

            if (password !== confirmPassword) {
                error.password = 'Password does not match'
                error.confirmPassword = 'Password does not match'
            } else {
                error.password = null
                error.confirmPassword = null
            }
        }


        //  validating email
        const email = user.email
        let regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        const isEmailValid = regexEmail.test(email)
        if (user.email.length > 0 && !isEmailValid) {
            error.email = 'Email is not valid'
        } else if (user.email.length > 0 && isEmailValid) {
            error.email = null
        }

        this.setState({
            error
        }, () => {
            console.log('formValidation state ==> ', this.state)

            //  checking the validation
            const isValid = error.name === null &&
                error.email === null &&
                error.password === null &&
                error.confirmPassword === null

            //  passing callback so that validation of the form is obtained in @see "onSubmit"
            callback(isValid)
        })
    }

    render() {
        console.log('======= login.js  render =============')
        console.log('login.js state ==> ', this.state)

        const {isLogin, user, error, message} = this.state

        return (
            <div>
                <div className="app-login-form">
                    <button className="app-dismiss-button" onClick={() => {
                        if (this.props.onClose) {
                            this.props.onClose()
                        }
                    }
                    }>Close
                    </button>

                    <div className="app-login-form-inner">
                        <h2 className="form-title">Sign-In</h2>

                        {/* FORM */}
                        <form onSubmit={this.onSubmitForm}>
                            {/* This would appear when there would be some error in creating user or logging in the user*/}
                            {
                                message.type ? <div className="app-message">
                                    <p className={message.type}>{message.message}</p>
                                </div> : null
                            }

                            {/* displaying "name" input field if "isLogin" is false*/}
                            {!isLogin ? <div>
                                <div
                                    className={Classnames('app-form-item', {'error': (error.name !== null && error.name.length > 0)})}>
                                    <label htmlFor="name">Name</label>
                                    <input type="text" name={"name"} value={user.name} placeholder={"Enter Name"}
                                           onChange={this.onTextFieldChange}/>
                                </div>
                            </div> : null}

                            <div
                                className={Classnames('app-form-item', {'error': (error.email !== null && error.email.length > 0)})}>
                                <label htmlFor="email-id">Email</label>
                                <input type="text" placeholder="Enter email address" id="email-id" name="email"
                                       onChange={this.onTextFieldChange}/>
                            </div>

                            <div
                                className={Classnames('app-form-item', {'error': (error.password !== null && error.password.length > 0)})}>
                                <label htmlFor="password-id">Password</label>
                                <input type="password" placeholder="Your password id" id="password-id" name="password"
                                       onChange={this.onTextFieldChange}/>
                            </div>

                            {
                                !isLogin ? <div>

                                    <div
                                        className={Classnames('app-form-item', {'error': (error.confirmPassword !== null && error.confirmPassword.length > 0)})}>
                                        <label htmlFor="confirm-password-id">Confirm Password</label>
                                        <input value={user.confirmPassword} onChange={this.onTextFieldChange}
                                               placeholder="Confirm password" id="confirm-password-id"
                                               type="password" name="confirmPassword"/>
                                    </div>
                                </div> : null
                            }

                            {/* displaying "confirm password" input field if "isLogin" is false*/}
                            {
                                isLogin ? <div className="app-form-actions">
                                    <button className="app-button primary">Sign In</button>
                                    <div className="app-form-description">
                                        <div>Don't have an account ? <button type="button" onClick={() => {
                                            this.setState({isLogin: false})
                                        }} className="app-button app-button-link">Sign Up</button></div>

                                    </div>
                                </div> : <div className="app-form-actions">
                                    <button className="app-button primary">Sign Up</button>
                                    <div className="app-form-description">
                                        <div>Have an account already? <button type="button" onClick={() => {

                                            this.setState({isLogin: true})

                                        }} className="app-button app-button-link">Sign In</button></div>

                                    </div>
                                </div>
                            }
                        </form>
                    </div>
                </div>
            </div>
        )
    }

    componentWillUnmount() {
        console.log('login.js componentWillUnmount')
    }
}

LoginForm.contextType = MyContext

export default LoginForm