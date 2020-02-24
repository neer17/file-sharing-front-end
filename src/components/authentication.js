/* eslint-disable */

import React, { Component } from "react"
import classNames from "classnames"

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

        console.info("Authentication.js displayName ==> ", displayName)
        // ...
      } else {
        console.info("Authentication.js user signed out")
        // User is signed out.
        // ...
      }
    })
  }

  googleSignIn = () => {
    triggerGoogleSignIn().then(res => {
      console.info(res)
    }).catch(error => {
      console.error(error)
    })
  }

  emailSignUp = e => {
    e.preventDefault()

    let {formError} = this.state

    const email = e.target.inputEmail.value
    const password = e.target.inputPassword.value
    const username = e.target.inputUsername.value
    const confirmPassword = e.target.inputConfirmPassword.value

    triggerEmailSignUp(email, password,confirmPassword, username)
    .then(response => {
      console.info("Email Signup response ==> ", response)
    }).catch(error => {
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

    let { formError } = this.state

    const email = e.inputEmail
    const password = e.inputPassword

    triggerEmailSignIn(email, password).then(res => {

    }).catch(error => {
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
    let { signUpComponentShown: signUpComponentShown, formError } = this.state
    
    return (
      <div className="authentication-container row ">
        {/* Carousel  */}
        <div className="carousel-div col-7 col-sm-0">
          <div id="demo" className="carousel slide" data-ride="carousel">
            {/* <!-- Indicators --> */}
            <ul className="carousel-indicators">
              <li data-target="#demo" data-slide-to="0" className="active"></li>
              <li data-target="#demo" data-slide-to="1"></li>
              <li data-target="#demo" data-slide-to="2"></li>
            </ul>

            {/* <!-- The slideshow --> */}
            <div className="carousel-inner">
              <div className="carousel-item active" id="carousel-item">
                <picture className="picture-container">
                  <img
                    className={"authentication-img"}
                    src={require("./../images/sample-1.jpeg")}
                    alt="Chicago"
                  ></img>
                </picture>
              </div>
              <div className="carousel-item" id="carousel-item">
                <picture className="picture-container">
                  <img
                    className={"authentication-img"}
                    src={require("./../images/sample-2.jpeg")}
                    alt="Chicago"
                  ></img>
                </picture>
              </div>
              <div className="carousel-item" id="carousel-item">
                <picture className="picture-container">
                  <img
                    className={"authentication-img"}
                    src={require("./../images/sample-3.jpeg")}
                    alt="Chicago"
                  ></img>
                </picture>
              </div>
            </div>
          </div>
        </div>

        {/* Authentication  */}
        <div className="authentication-div col-5">
          <div className="heading display-1 text-center mb-3">Share It</div>
          <div className="title display-4 text-center mb-4">
            Welcome to Share It
          </div>
          {/* Error Dialog */}
          {formError ? <div className="errorDialog mb-2">{formError}</div> : null}

          {/* FORM: submitting it based on value of signUpComponentShown*/}
          <div className="sign-in__form mb-3">
            <form onSubmit={ signUpComponentShown ? this.emailSignUp : this.emailSignIn}>
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

              <button
                type="submit"
                className="btn btn-primary submitBtn h6 mt-1"
              >
                Login
              </button>
            </form>
          </div>
          <div className="or__div"></div>
          <div className="google-sign-in btn btn-primary d-block mb-3 h6" onClick={this.firebaseLogin}>
            Sign In with Google
          </div>
          {signUpComponentShown ? <div className="create-account btn btn-primary h6" onClick={this.showSignInComponent}>
            Existing user? Sign-in instead
          </div> : <div className="create-account btn btn-primary h6" onClick={this.showSignUpComponent}>
            New User? Create Account
          </div>}
        </div>
      </div>
    )
  }
}

export default Authentication
