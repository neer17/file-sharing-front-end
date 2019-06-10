import axios from 'axios'

export const postDownload = (postId) => {
    return axios.get(`http://localhost:3001/share/${postId}`)
}