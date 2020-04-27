/* eslint-disable */

import React, { Component } from "react"
import classNames from "classnames"

import Icon from "./Icon"
import { MyContext } from "./Provider"
import {
  triggerEmailSignIn,
  triggerGoogleSignIn,
  triggerEmailSignUp,
  firebase,
} from "../utils/firebaseAuth"
import {
  INVALID_EMAIL,
  EMPTY_EMAIL,
  EMPTY_PASSWORD,
  EMPTY_CONFIRM_PASSWORD,
  EMPTY_USERNAME,
  PASSWORD_DOES_NOT_MATCH,
  AUTH_STATE,
} from "../utils/constants"
import { reactLocalStorage } from "reactjs-localstorage"

class Authentication extends Component {
  state = {
    signUpComponentShown: false,
    formError: null,
  }

  /* listen for Auth changes */
  componentDidMount() {
    const FUNC_TAG = "componentDidMount: "

    console.info(FUNC_TAG)

    //  register listener to run "cleanUpCode" before component unloads
    window.addEventListener("beforeunload", this.cleanUpCode)

    // read local storage to change the local state
    const stateLS = reactLocalStorage.getObject(AUTH_STATE)
    if (stateLS)
      this.setState({
        ...stateLS,
      })
  }

  cleanUpCode = () => {
    reactLocalStorage.setObject(AUTH_STATE, this.state)
  }
  googleSignIn = (e) => {
    e.preventDefault()

    triggerGoogleSignIn().then().catch(console.error)
  }

  logout = () => {
    localStorage.clear() //  to clear the token
    firebase.auth().signOut().catch(console.error)
  }

  emailSignUp = (e) => {
    e.preventDefault()

    let { formError } = this.state

    const email = e.target.inputEmail.value
    const password = e.target.inputPassword.value
    const username = e.target.inputUsername.value
    const confirmPassword = e.target.inputConfirmPassword.value

    triggerEmailSignUp(email, password, confirmPassword, username)
      .then((response) => {
        console.info("Email Signup response ==> ", response)
      })
      .catch((error) => {
        console.error("Email Signup error => ", error)
        switch (error) {
          case INVALID_EMAIL: {
            formError = INVALID_EMAIL
            break
          }
          case EMPTY_EMAIL: {
            formError = EMPTY_EMAIL
            break
          }
          case EMPTY_PASSWORD: {
            formError = EMPTY_PASSWORD
            break
          }
          case EMPTY_CONFIRM_PASSWORD: {
            formError = EMPTY_CONFIRM_PASSWORD
            break
          }
          case PASSWORD_DOES_NOT_MATCH: {
            formError = PASSWORD_DOES_NOT_MATCH
            break
          }
          case EMPTY_USERNAME: {
            formError = EMPTY_USERNAME
            break
          }
          default: {
            // to handle error from firebase
          }
        }

        this.setState({
          formError,
        })
      })
  }

  emailSignIn = (e) => {
    e.preventDefault()

    let { formError } = this.state

    const email = e.target.inputEmail.value
    const password = e.target.inputPassword.value

    triggerEmailSignIn(email, password)
      .then((res) => {
        console.info("EmailSignIn ==> ", res.user.email)
      })
      .catch((error) => {
        console.error(error)
        switch (error) {
          case INVALID_EMAIL: {
            formError = INVALID_EMAIL
            break
          }
          case EMPTY_EMAIL: {
            formError = EMPTY_EMAIL
            break
          }
          case EMPTY_PASSWORD: {
            formError = EMPTY_PASSWORD
            break
          }
          default: {
            // handle error from Firebase
          }
        }

        this.setState({
          formError,
        })
      })
  }

  showSignUpComponent = (e) => {
    e.preventDefault()

    this.setState({
      signUpComponentShown: true,
    })
  }
  showSignInComponent = (e) => {
    e.preventDefault()

    this.setState({
      signUpComponentShown: false,
    })
  }

  render() {
    // console.info("=================== render ======================")

    let { signUpComponentShown: signUpComponentShown, formError } = this.state

    return (
      <div className="authentication-div p-4">
        {/* Heading */}
        <div className="d-flex flex-row justify-content-center">
          <div className="p-2 align-self-center">
            <Icon size={"3rem"}/>
          </div>
          <div
            className={classNames(
              signUpComponentShown
                ? "heading display-5 text-center mb-1 text-uppercase"
                : "heading display-4 text-center mb-3 text-uppercase"
            )}
          >
            Share
          </div>
        </div>
        <div
          className={classNames(
            signUpComponentShown
              ? "title display-6 text-center mb-2 text-uppercase"
              : "title h1 text-center mb-4 text-uppercase"
          )}
        >
          Welcome to Share
        </div>

        {/* Error Dialog */}
        {formError ? <div className="errorDialog mb-2">{formError}</div> : null}

        {/* FORM: submitting it based on value of signUpComponentShown*/}
        <div className="sign-in__form mb-3">
          <form
            onSubmit={
              signUpComponentShown ? this.emailSignUp : this.emailSignIn
            }
          >
            {/* when signUpComponentShown = true */}
            {signUpComponentShown ? (
              <div className="form-group display-6 mb-1">
                <label htmlFor="inputUsername">Username</label>
                <input
                  type="text"
                  className="form-control inputUsername input-height"
                  id="inputUsername"
                ></input>
              </div>
            ) : null}

            <div
              className={classNames(
                signUpComponentShown
                  ? "form-group display-6 mb-1"
                  : "form-group"
              )}
            >
              <label htmlFor="inputEmail">Email address</label>
              <input
                type="email"
                className="form-control inputEmail input-height"
                id="inputEmail"
              ></input>
            </div>
            <div
              className={classNames(
                signUpComponentShown
                  ? "form-group display-6 mb-1"
                  : "form-group"
              )}
            >
              <label htmlFor="inputPassword">Password</label>
              <input
                type="password"
                className="form-control inputPassword input-height"
                id="inputPassword"
              ></input>
            </div>

            {/* when signUpComponentShown = true */}
            {signUpComponentShown ? (
              <div className="form-group display-6 mb-1">
                <label htmlFor="inputConfirmPassword">Confirm Password</label>
                <input
                  type="password"
                  className="form-control inputConfirmPassword input-height"
                  id="inputConfirmPassword"
                ></input>
              </div>
            ) : null}

            <button
              type="submit"
              className={classNames(
                signUpComponentShown
                  ? "btn btn-primary btn-block display-6 mt-2 mb-2"
                  : "btn btn-primary btn-block h6 mt-2 mb-2"
              )}
            >
              {signUpComponentShown ? "Sign-Up" : "Login"}
            </button>
            {/* <button
              type="button"
              className="btn btn-primary submitBtn h6 mt-1"
              onClick={this.logout}
            >
              Logout
            </button> */}
          </form>

          <div
            className={classNames(
              signUpComponentShown
                ? "google-sign-in mb-1"
                : "google-sign-in mb-3"
            )}
          >
            <a href="" onClick={this.googleSignIn}>
              <img
                src={require("../images/google_sign_in.png")}
                alt="Google Sign In"
                className="google-sign-in-logo"
              />
            </a>
          </div>
          {signUpComponentShown ? (
            <div
              className="create-account display-6"
              onClick={this.showSignInComponent}
            >
              Existing user? Sign-in instead
            </div>
          ) : (
            <div
              className="create-account h6"
              onClick={this.showSignUpComponent}
            >
              New User? Create Account
            </div>
          )}
        </div>
      </div>
    )
  }

  componentWillUnmount() {
    // console.info('componentWillUnmount')
    window.removeEventListener("beforeunload", this.cleanUpCode)
  }
}

Authentication.contextType = MyContext

export default Authentication
