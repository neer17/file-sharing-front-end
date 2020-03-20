import axios from "axios"
import { url } from "./domainConfig"

export const upload = (state, callback = events => {}) => {
  const { files, form } = state

  // console.log('upload.js files ==> ', files)
  //  creating an instance of form to send to the backend
  let data = new FormData()

  //  adding each file to the "photos" key in the form
  files.values.forEach(file => {
    data.append("photos", file)
  })

  //  storing the info from the "form" in data
  const { to, from, message } = form
  data.append("to", to)
  data.append("from", from)
  data.append("message", message)

  // "onUploadProgress" would run when the files would being uploaded
  //  "onUploadProgress" would be called and all the details of files would be present in "event"
  const config = {
    onUploadProgress: event => {
      callback({
        type: "onUploadProgress",
        payload: event
      })
    }
  }

  //  making a POST upload-file call
  //  sending all the data to the backend
  //  res would get whatever data has come back from the server
  //  check out "index.js" line 126 to see what is coming back from the server
  axios
    .post(`${url}/upload-file`, data)
    .then(res => {
      return callback({
        type: "success",
        payload: res
      })
    })
    .catch(err => {
      return callback({
        type: "error",
        payload: err
      })
    })
}
