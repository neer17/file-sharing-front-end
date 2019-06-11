import React, {Component} from 'react'
import _ from 'lodash'

import {postDownload} from "../helper/postDownload"
import {url} from './../helper/domainConfig'
import {betterNumber} from "../helper/betterNumber"
import './../components/sass_files/copied.css'

class ViewFile extends Component {

    constructor(props) {
        super(props)

        this.state = {
            post: null
        }

        this.getTotalDownloadSize = this.getTotalDownloadSize.bind(this)
    }

    /**
     * We'll shave access to props because of the "history" package
     */
    componentDidMount() {
        const {match} = this.props

        const postId = _.get(match, 'params.id')

        //  this will make a request to the server, which would get all the details of the file and
        //  then in the response we would be having access to those details

        /**
         * this method won't wait for the below async function to finish the call, instead it would call render while
         * async function runs on some other thread
         * So, get a default value null or empty array to keep the app from crashing, it can be done easily using lodash
         * and then in the next render when async function gives the result the state would change and a re-render would happen
         * and then every thing would run fine
         */
        postDownload(postId).then((response) => {

            this.setState({
                post: _.get(response, 'data')
            }, () => {
            })
        }).catch((err) => {
            console.log("an error fetching download data", err)// we can redirect user to not found page later
        })
    }


    getTotalDownloadSize() {
        const {post} = this.state

        let total = 0
        const filesIds = _.get(post, 'files', [])

        _.each(filesIds, (fileId) => {

            total += _.get(fileId, 'size', 0)
        })

        return betterNumber(total, true)
    }

    render() {
        const {post} = this.state
        const files = _.get(post, 'files', [])
        const totalSize = this.getTotalDownloadSize()
        const postId = _.get(post, '_id', null)

        return (
            <div className={'app-page-download'}>
                {/*<div className={'app-top-header'}>
                    <h1 onClick={() => {
                        //  going back to the "Home" page
                        history.push('/')

                    }}><i className={'icon-paper-plane'}/> SHARE</h1>
                </div>*/}
                <div className={'app-card app-card-download'}>

                    <div className={'app-card-content'}>
                        <div className={'app-card-content-inner'}>
                            <div className={'app-download-icon'}>
                                <i className={'icon-download'}/>
                            </div>

                            <div className={'app-download-message app-text-center'}>
                                <h2>Ready to download</h2>
                                <ul>
                                    <li>{files.length} files</li>
                                    <li>{totalSize}</li>
                                    <li>Expires in 30 days</li>
                                </ul>
                            </div>

                            <div className={'app-download-file-list'}>
                                {
                                    files.map((file, index) => {

                                        return (<div key={index} className={'app-download-file-list-item'}>
                                            <div className={'filename'}>{_.get(file, 'originalname')}</div>
                                            <div className={'download-action'}><a
                                                href={`${url}/download/${_.get(file, '_id')}`}>Download</a></div>
                                        </div>)
                                    })
                                }
                            </div>

                            <div className={'app-download-actions app-form-actions'}>

                                <a href={`${url}/downloadAllFiles/${postId}`} className={'app-button primary'}>Download
                                    All</a>
                                <button className={'app-button'} type={'button'}>Share</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default ViewFile