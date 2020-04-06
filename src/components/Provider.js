/*
 * This would contain global variables
 * that can be changed from anywhere from the app using the "Context"
 * */
import React, { Component } from "react"

import { reactLocalStorage } from "reactjs-localstorage"

const Context = React.createContext()

Context.displayName = "ReactContext1"

export class Provider extends Component {
  constructor(props) {
    super(props)
    console.info("constructor")

    this.state = {
      componentToRender: "HomeForm",
      uploadEvent: null,
      data: null,
      isAuthenticated: false,
      showMoreFilesPanel: false,
      files: []
    }
  }

  componentDidMount() {
    console.info("componentDidMount")

    window.addEventListener('beforeunload', this.cleanUpCode)
  }

  updateState = (object = {}) => {
    this.setState(
      {
        ...object
      },
      () => {
        console.info("provider.js state ==> ", this.state)
      }
    )
  }

  getState = () => {
    return this.state
  }

  //  getting the name of the file and then removing it from the values and finally
  //  updating the state with new "values"
  cancel = nameOfFile => {
    const files = this.state.files

    files.forEach((file, index) => {
      if (file.name === nameOfFile) {
        return files.splice(index, 1)
      }
    })

    this.setState({
      files
    })
  }

  cleanUpCode = () => {
      reactLocalStorage.setObject('state', this.state)
  }

  render() {
    console.info("render")

    return (
      //  state will now be available to all the components
      //  as this Provider class would be wrapped around all the components in App.js
      //  updating and getting the state with respective methods
      <Context.Provider
        value={{
          updateState: this.updateState,
          getState: this.getState,
          cancel: this.cancel
        }}
      >
        {this.props.children}
      </Context.Provider>
    )
  }

  componentWillUnmount() {
    console.info("componentWillUnmount")
    window.removeEventListener('beforeunload', this.cleanUpCode)
  }
}

//  wrap "Consumer" around the stuff in return in any file to get the items passed in "value" above
export const MyContext = Context
