import axios from "axios"

import { url } from "./domainConfig"

export const upload = (form, files, callback = (events) => {}) => {
  const FUNC_TAG = "upload"


  // console.log('upload.js url ==> ', url)
  //  creating an instance of form to send to the backend
  let data = new FormData()

  //  adding each file to the "photos" key in the form
  files.forEach((file) => {
    data.append("photos", file)
  })

  //  storing the info from the "form" in data
  const { to, from, message } = form
  data.append("to", to)
  data.append("from", from)
  data.append("message", message)

  /*
   * onUploadProgress would be called multiple times on a slow network
   */
  //  cancellation token
  const source = axios.CancelToken.source()

  const config = {
    onUploadProgress: (event) => {
      // console.info("progress:", event)
      callback({
        type: "onUploadProgress",
        payload: event,
        cancelSource: source
      })
    },
    cancelToken: source.token,
  }

  //  making a POST upload-file call
  //  sending all the data to the backend
  //  res would get "post" object
  axios
    .post(`${url}/upload-file`, data, config)
    .then((res) => {
      return callback({
        cancelSource: source,
        type: "success",
        payload: res,
      })
    })
    .catch((err) => {
      if (axios.isCancel(err))
        console.error("Axios request cancelled: error: ", err)

      return callback({
        cancelSource: source,
        type: "error",
        payload: err,
      })
    })
}
