import axios from 'axios'
import {url} from './domainConfig'

export const postDownload = (postId) => {
    return axios.get(`${url}/share/${postId}`)
}