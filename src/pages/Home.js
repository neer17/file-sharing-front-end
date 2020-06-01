/* eslint-disable */

import React, { Component } from "react"
import jwt from "jsonwebtoken"
import { CircularProgress } from "@material-ui/core"

import TopPartHome from "../components/TopPart"
import HomeForm from "../components/HomeForm"
import HomeUploading from "../components/HomeUploading"
import HomeUploadSent from "../components/HomeUploadSent"
import Panel from "../components/Panel"
import { MyContext } from "../components/Provider"
import Authentication from "../components/Authentication"
import Carousel from "../components/Carousel"
import { firebase } from "../utils/firebaseAuth"
import CreateUser from "../utils/createUser"
import { JWT_TOKEN_LOCAL_STORAGE } from "../utils/constants"
import history from "./../utils/history"
import { upload } from "./../utils/upload"

/*
 * The state of this class is maintained using "Context" APi
 * "Provider.js" only contains the state of this class
 * */
class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      componentToRender: "Authentication",
      uploadEvent: {
        type: null,
        payload: null,
        cancelSource: null,
      },
      userEmail: null,
      makePanelVisible: false,
      files: [],
    }

    this.authChangeListener = this.authChangeListener.bind(this)
  }

  //  listen auth changes from Firebase
  authChangeListener() {
    const FUNC_TAG = "Home.js: authChangeListener: "

    const classContext = this

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        var displayName = user.displayName
        var email = user.email
        var uid = user.uid

        console.info(FUNC_TAG, "user.email: ", email)

        //  progress bar

        //  get token from session storage, validate
        const jwtTokenFromLS = localStorage.getItem(JWT_TOKEN_LOCAL_STORAGE)

        /* if jwt token is found login otherwise create user */
        if (jwtTokenFromLS) {
          try {
            jwt.verify(jwtTokenFromLS, process.env.REACT_APP_JWT_TOKEN_SECRET)

            classContext.setState(
              {
                componentToRender: "HomeForm",
                userEmail: user.email,
              },
              () => {
                classContext.context.updateState({
                  isAuthenticated: true,
                })
              }
            )
          } catch (error) {
            //  invalid token, log-out
            console.error(error)
            classContext.logout()
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
            .then((response) => {
              if (response)
                classContext.setState(
                  {
                    componentToRender: "HomeForm",
                    userEmail: user.email,
                  },
                  () => {
                    classContext.context.updateState({
                      isAuthenticated: true,
                    })
                  }
                )
            })
            .catch(console.error)
        }
      } else {
        console.info(FUNC_TAG, "no user or logout")

        classContext.setState(
          {
            componentToRender: "Authentication",
          },
          () => {
            classContext.context.updateState({
              isAuthenticated: false,
            })
          }
        )
      }
    })
  }

  triggerUploading = (form, files) => {
    /*  this would be called multiple times on a slow network
     */
    upload(form, files, (event) => {
      const { type, payload, cancelSource } = event

      //  @see upload.js
      const componentToRender =
        type === "success" ? "HomeUploadSent" : "HomeUploading"
      let data = type === "success" ? payload.data : payload

      // console.info("HomeForm", "data => ", data)

      const uploadEvent = {
        type,
        payload: data,
        cancelSource,
      }

      this.setState(
        {
          componentToRender,
          uploadEvent,
        },
        () => {
          console.info("state", this.state)
        }
      )
    })
  }
  //  switching the components
  renderComponent = () => {
    const { componentToRender } = this.state

    console.info("componentToRender ==> ", componentToRender)

    switch (componentToRender) {
      case "HomeUploading":
        const { uploadEvent } = this.state

        return (
          <HomeUploading
            uploadEvent={uploadEvent}
            onCancel={() => {
              this.setState({
                componentToRender: "HomeForm",
                uploadEvent: {
                  type: null,
                  payload: null,
                  cancelSource: null,
                },
              })
            }}
            changeComponent={(componentToRender) => {
              this.setState({
                componentToRender,
              })
            }}
          />
        )
      case "HomeUploadSent":
        return (
          <HomeUploadSent
            onSendAnotherFile={() => {
              this.setState({
                componentToRender: "HomeForm",
              })
            }}
            data={this.state.uploadEvent.payload}
            changeComponent={(componentToRender) => {
              this.setState({
                componentToRender,
              })
            }}
          />
        )

      case "Authentication":
        return (
          <Authentication
            changeComponent={(componentToRender) => {
              this.setState({
                componentToRender,
              })
            }}
          />
        )

      //  this would run if the "componentToRender" == "HomeForm" or otherwise
      case "HomeForm":
        return (
          <HomeForm
            onUploading={(form, files) => {
              this.triggerUploading(form, files)
            }}
            changeComponent={(componentToRender) => {
              this.setState({
                componentToRender,
              })
            }}
            userEmail={this.state.userEmail}
            showPanel={(makePanelVisible) => {
              this.setState({
                makePanelVisible,
              })
            }}
            updateFiles={(files) => {
              this.setState({
                files,
              })
            }}
            files={this.state.files}
            cancel={(filename) => {
              this.cancel(filename)
            }}
          />
        )
    }
  }

  // remove files from state
  cancel = (nameOfFile) => {
    const files = this.state.files

    files.forEach((file, index) => {
      if (file.name === nameOfFile) {
        return files.splice(index, 1)
      }
    })

    this.setState({
      files,
    })
  }

  closePanel = () => {
    this.setState({
      showPanel: false,
    })
  }

  logout = () => {
    localStorage.clear() //  to clear the token
    firebase.auth().signOut().catch(console.error)
  }

  render() {
    console.info("state: ", this.state)
    const { makePanelVisible } = this.state

    return (
      <div className={"home-container container"}>
        <div className="main-box row">
          {/* LEFT PART  */}
          <div className="home-left-container d-none d-lg-block col-6 pl-0 pr-0">
            <Carousel />
          </div>

          {/* RIGHT PART ( this changes based on values in Provider.js ) */}
          <div className="home-right-container col col-lg-6">
            <div className="home-right-component">{this.renderComponent()}</div>
          </div>

          {/* MORE FILES PANEL */}
          {makePanelVisible === true ? (
            <Panel
              showPanel={(makePanelVisible) => {
                this.setState({
                  makePanelVisible,
                })
              }}
              files={this.state.files}
              cancel={(fileName) => {
                this.cancel(fileName)
              }}
            />
          ) : null}
        </div>
      </div>
    )
  }

  componentDidMount() {
    const FUNC_TAG = "Home.js: componentDidMount: "
    // console.info(FUNC_TAG)

    this.authChangeListener()
  }

  componentWillUnmount() {
    // console.info("componentWillUnmount")
  }
}

Home.contextType = MyContext

export default Home
