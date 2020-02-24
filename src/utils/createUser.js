import axios from 'axios'

import {url} from './domainConfig'

console.log('createUser url ==> ', url)

class CreateUser {
    constructor(user) {
        this.user = user
    }

    createUserUsingAxios() {
        const finalUrl = url + '/create_user'
        return axios.post(finalUrl, this.user)
    }

    signInUser() {
        const finalUrl = url + '/sign-in'
        return axios.post(finalUrl, this.user)
    }
}

export default CreateUser