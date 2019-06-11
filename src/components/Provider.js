/*
* This would contain global variables
* that can be changed from anywhere from the app using the "Context"
* */
import React, {Component} from 'react'

const Context = React.createContext()

export class Provider extends Component {
    constructor(props) {
        super(props)
        this.state = {
            componentToRender: 'Authentication',
            uploadEvent: null,
            data: null,
            isAuthenticated: false
        }
    }


    updateState = (object = {}) => {
        this.setState({
            ...object
        }, () => {
            // console.log('provider.js state ==> ', this.state)
        })
    }

    getState = () => {
        return this.state
    }

    render() {
        return (
            //  state will now be available to all the components
            //  as this Provider class would be wrapped around all the components in App.js
            //  updating and getting the state with respective methods
            <Context.Provider value={{
                updateState: this.updateState,
                getState: this.getState,
            }}>
                {this.props.children}
            </Context.Provider>
        )
    }
}

//  wrap "Consumer" around the stuff in return in any file to get the items passed in "value" above
export const MyContext = Context
