import React, { Component } from "react"

import { Route, Router, Switch, withRouter } from "react-router-dom"
import WebFont from "webfontloader"
import jwt from "jsonwebtoken"

import { firebase } from "../utils/firebaseAuth"
import Home from "../pages/Home"
import ViewFile from "../pages/ViewFile"
import ErrorBoundary from "../components/ErrorBoundary"
import history from "./../utils/history"
import { MyContext } from "../components/Provider"

import CreateUser from "../utils/createUser"
import { JWT_TOKEN_LOCAL_STORAGE } from "../utils/constants"

class AuthListenerWrapper extends Component {
  componentDidMount() {
    WebFont.load({
      google: {
        families: ["Roboto Slab:300", "sanss-serif"],
      },
    })

    this.authChangeListener()
  }

  render() {
    return (
      <>
        {/* main container */}
        <div className="app__main-container container">
          <ErrorBoundary>
            <Router history={history}>
              <Switch>
                <Route exact path={"/"} component={Home} />
                <Route path={"/share/:id"} component={withRouter(ViewFile)} />
              </Switch>
            </Router>
          </ErrorBoundary>
        </div>
      </>
    )
  }

  //  listen auth changes from Firebase
  authChangeListener = () => {
    const FUNC_TAG = "Home.js: authChangeListener: "
    
    const myContext = this.context

    this.firebaseAuthListener = firebase
      .auth()
      .onAuthStateChanged(function (user) {
        if (user) {
          // User is signed in.
          var displayName = user.displayName
          var email = user.email
          var uid = user.uid

          //  get token from session storage, validate
          const jwtTokenFromLS = localStorage.getItem(JWT_TOKEN_LOCAL_STORAGE)

          /* if jwt token is found login otherwise create user */
          if (jwtTokenFromLS) {
            try {
              jwt.verify(jwtTokenFromLS, process.env.REACT_APP_JWT_TOKEN_SECRET)

              myContext.updateState({
                componentToRender: "HomeForm",
                userEmail: user.email,
                isAuthenticated: true,
              })
            } catch (error) {
              //  invalid token, log-out
              console.error(error)
              myContext.logout()
            }
          } else {
            //  generating jwt, sending jwt to backend
            const jwtToken = jwt.sign(
              {
                data: {
                  name: displayName,
                  email: email,
                  uid: uid,
                },
              },
              process.env.REACT_APP_JWT_TOKEN_SECRET,
              {
                expiresIn: "24h",
              }
            )

            //  store in local storage and send to backend
            localStorage.setItem(JWT_TOKEN_LOCAL_STORAGE, jwtToken)

            CreateUser.createUserFirebase(user)
              .then(response => {
                if (response)
                  myContext.updateState(
                    {
                      componentToRender: "HomeForm",
                      userEmail: user.email,
                      isAuthenticated: true,
                    },
                    () => {
                      console.info("New user logged in")
                    }
                  )
              })
              .catch(console.error)
          }
        } else {
          console.info(FUNC_TAG, "no user or logout")

          history.replace("/")
          myContext.updateState({
            componentToRender: "Authentication",
            isAuthenticated: false,
          })
        }
      })
  }

  logout = () => {
    localStorage.clear() //  to clear the token
    firebase.auth().signOut().catch(console.error)
  }

  componentWillUnmount() {
    this.firebaseAuthListener && this.firebaseAuthListener()
    this.authChangeListener = undefined
  }
}

AuthListenerWrapper.contextType = MyContext

export default AuthListenerWrapper
