import React, {Component} from 'react'
import axios from 'axios'

import LeftPartHome from './../components/left-part-home'
import HomeForm from './../components/home-form'
import HomeUploading from './../components/home-uploading'
import HomeUploadSent from './../components/home-upload-sent'
import {MyContext} from './../components/Provider'
import './../helper.css'
import './../App.css'
import Authentication from '../components/authentication'
import {url} from './../helper/domainConfig'

/*
* The state of this class is maintained using "Context" APi
* "Provider.js" only contains the state of this class
* states are being updated from "login.js" to update the "isAuthenticated" and "componentToRender" members after login as well
* */
class Home extends Component {

//  switching the components
    _renderComponent = () => {
        const state = this.props.context.getState()
        const {componentToRender} = this.props.context.getState()

        switch (componentToRender) {
            case 'HomeUploading':
                const {type, payload} = state.uploadEvent
                return <HomeUploading
                    type={type}
                    payload={payload}
                    onCancel={() => {
                        this.props.context.updateState({
                            componentToRender: 'HomeForm',
                            uploadEvent: null,
                            data: null
                        })
                    }
                    }
                />
            case 'HomeUploadSent':
                return <HomeUploadSent onSendAnotherFile={() => {
                    this.props.context.updateState({
                        componentToRender: 'HomeForm'
                    })
                }
                } data={state.data}/>

            case 'Authentication':
                return <Authentication/>
            //  this would run if the "componentToRender" == "HomeForm" or otherwise
            default:
                return <HomeForm onUploading={(events) => {
                    const {type} = events

                    let componentToRender = type === 'success' ? 'HomeUploadSent' : 'HomeUploading'
                    let data = type === 'success' ? events.payload.data : null

                    this.props.context.updateState({
                        componentToRender,
                        uploadEvent: events,
                        data
                    })
                }
                }/>
        }
    }

    render() {
        return (
            <div className={"row root-class"}>
                <div className={"container mt-5"}>
                    <div className={"d-flex align-items-center justify-content-center"}>
                        {/*This is the left side */}
                        <div className={"col col-md-6 "}>
                            <div className={"m-auto "}>
                                <LeftPartHome/>
                            </div>
                        </div>

                        {/*Calling the right side*/}
                        {this._renderComponent()}
                    </div>
                </div>
            </div>
        )
    }

    /*
    * This method would run in the second render when the global state in Provider.js" would change after login and
    * then it would set a timer that would check the expiration if the token generated at the time of sign-in and log-in
    * */
    componentDidUpdate(prevProps, prevState, snapshot) {
        const {isAuthenticated} = this.props.context.getState()

        if (isAuthenticated) {
            const userId = localStorage.getItem("userId")

            //  making a POST request to /check-validation to check the expiration of user session
            const setIntervalCountdown = setInterval(() => {
                axios.post(`${url}/check-validation`, {
                    userId
                }).catch(err => {
                    if (err.response.status === 401) {
                        clearInterval(setIntervalCountdown)

                        this.props.context.updateState({
                            componentToRender: 'Authentication',
                            isAuthenticated: false
                        })
                    }
                })
            }, 1000 * 60 * 60 * 24)
        }
    }

}

//  By doing this the context of "Provider.js" would be available in the props (this.props.context)
const withContext = (Component) => {
    return (props) => {
        return <MyContext.Consumer>
            {(context) => {
                return <Component {...props} context={context}/>
            }}
        </MyContext.Consumer>
    }
}


export default withContext(Home)
