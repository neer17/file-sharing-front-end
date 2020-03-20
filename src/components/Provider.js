/*
* This would contain global variables
* that can be changed from anywhere from the app using the "Context"
* */
import React, {Component} from 'react'

const Context = React.createContext()

Context.displayName = 'ReactContext1'

export class Provider extends Component {
    constructor(props) {
        super(props)

        this.state = {
            componentToRender: 'HomeForm',
            uploadEvent: null,
            data: null,
            isAuthenticated: false,
            showMoreFilesPanel: false,
            files: []
        }
    }


    updateState = (object = {}) => {
        this.setState({
            ...object
        }, () => {
            console.info('provider.js state ==> ', this.state)
        })
    }

    getState = () => {
        return this.state
    }

    cancel = nameOfFile => {
        //  getting the name of the file and then removing it from the values and finally
        //  updating the state with new "values"
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

    render() {
        return (
            //  state will now be available to all the components
            //  as this Provider class would be wrapped around all the components in App.js
            //  updating and getting the state with respective methods
            <Context.Provider value={{
                updateState: this.updateState,
                getState: this.getState,
                cancel: this.cancel
            }}>
                {this.props.children}
            </Context.Provider>
        )
    }
}

//  wrap "Consumer" around the stuff in return in any file to get the items passed in "value" above
export const MyContext = Context
