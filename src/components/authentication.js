/* eslint-disable */

import React, { Component } from "react"
import classNames from "classnames"

import { MyContext } from "./Provider"
import {
  triggerEmailSignIn,
  triggerGoogleSignIn,
  triggerEmailSignUp,
  firebase
} from "../utils/firebaseAuth"
import {
  INVALID_EMAIL,
  EMPTY_EMAIL,
  EMPTY_PASSWORD,
  EMPTY_CONFIRM_PASSWORD,
  EMPTY_USERNAME,
  PASSWORD_DOES_NOT_MATCH
} from "./../utils/constants"

class Authentication extends Component {
  state = {
    signUpComponentShown: false,
    formError: null
  }

  // listening for Auth changes
  componentDidMount() {
    console.info("componentDidMount context ==> ", this.context.getState())
    const context = this.context
    // localStorage.clear()
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        var displayName = user.displayName
        var email = user.email
        var emailVerified = user.emailVerified
        var photoURL = user.photoURL
        var isAnonymous = user.isAnonymous
        var uid = user.uid
        var providerData = user.providerData

        console.info("componentDidMount user found ==> ", user.email)
        // change the component to "HomeForm" when the user is signed in or signed up

        context.updateState({
          componentToRender: "HomeForm"
        })
      } else {
        console.info("componentDidMount user not found/signed out")
      }
    })
  }

  googleSignIn = e => {
    e.preventDefault()

    triggerGoogleSignIn()
      .then()
      .catch(console.error)
  }

  logout = () => {
    firebase
      .auth()
      .signOut()
      .then()
      .catch(console.error)
  }

  emailSignUp = e => {
    e.preventDefault()

    let { formError } = this.state

    const email = e.target.inputEmail.value
    const password = e.target.inputPassword.value
    const username = e.target.inputUsername.value
    const confirmPassword = e.target.inputConfirmPassword.value

    triggerEmailSignUp(email, password, confirmPassword, username)
      .then(response => {
        console.info("Email Signup response ==> ", response)
      })
      .catch(error => {
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
          formError
        })
      })
  }

  emailSignIn = e => {
    e.preventDefault()
    console.info("EmailSignIn")

    let { formError } = this.state

    const email = e.target.inputEmail.value
    const password = e.target.inputPassword.value

    triggerEmailSignIn(email, password)
      .then(res => {
        console.info("EmailSignIn ==> ", res.user.email)
      })
      .catch(error => {
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
          formError
        })
      })
  }

  showSignUpComponent = e => {
    e.preventDefault()

    this.setState({
      signUpComponentShown: true
    })
  }
  showSignInComponent = e => {
    e.preventDefault()

    this.setState({
      signUpComponentShown: false
    })
  }

  render() {
    console.info("=================== render ======================")

    let { signUpComponentShown: signUpComponentShown, formError } = this.state

    return (
      <div className="authentication-div p-4">
        <div className="heading display-4 text-center mb-3 text-uppercase">
          Share
        </div>
        <div className="title h1 text-center mb-4 text-uppercase">
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
              <div className="form-group">
                <label for="inputUsername h6">Username</label>
                <input
                  type="text"
                  className="form-control inputUsername"
                  id="inputUsername"
                  aria-describedby="passwordHelp"
                ></input>
              </div>
            ) : null}

            <div className="form-group">
              <label for="inputEmail text-muted h6">Email address</label>
              <input
                type="email"
                className="form-control inputEmail"
                id="inputEmail"
              ></input>
            </div>
            <div className="form-group">
              <label for="inputPassword h6">Password</label>
              <input
                type="password"
                className="form-control inputPassword"
                id="inputPassword"
                aria-describedby="passwordHelp"
              ></input>
            </div>
            {/* when signUpComponentShown = true */}
            {signUpComponentShown ? (
              <div className="form-group mb-2">
                <label for="inputConfirmPassword text-muted h6">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-control inputConfirmPassword"
                  id="inputConfirmPassword"
                ></input>
              </div>
            ) : null}

            <button type="submit" className="btn btn-primary submitBtn h6 mt-1">
              Login
            </button>
            <button
              type="button"
              className="btn btn-primary submitBtn h6 mt-1"
              onClick={this.logout}
            >
              Logout
            </button>
          </form>
        </div>
        <div className="or__div"></div>
        <div className="google-sign-in mb-3 h6">
          <a href="" onClick={this.googleSignIn}>
            <img
              src={require("../images/google_sign_in.png")}
              alt="Google Sign In"
              className="google-sign-in-logo"
            />
          </a>
        </div>
        {signUpComponentShown ? (
          <div className="create-account h6" onClick={this.showSignInComponent}>
            Existing user? Sign-in instead
          </div>
        ) : (
          <div className="create-account h6" onClick={this.showSignUpComponent}>
            New User? Create Account
          </div>
        )}
      </div>
    )
  }
}

Authentication.contextType = MyContext

export default Authentication
