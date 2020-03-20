/* eslint-disable */

import firebase from "firebase"
import validator from "validator"

import {
  INVALID_EMAIL,
  EMPTY_EMAIL,
  EMPTY_PASSWORD,
  EMPTY_CONFIRM_PASSWORD,
  EMPTY_USERNAME,
  PASSWORD_DOES_NOT_MATCH
} from "./constants.js"


//  initializing firebase
const firebaseConfig = {
  apiKey: "AIzaSyC91KBhO07a44v_M72KJbLjmuzHd1FJ9G0",
  authDomain: "filesharingapp-117c3.firebaseapp.com",
  databaseURL: "https://filesharingapp-117c3.firebaseio.com",
  projectId: "filesharingapp-117c3",
  storageBucket: "filesharingapp-117c3.appspot.com",
  messagingSenderId: "38414507205",
  appId: "1:38414507205:web:6ddb10eaad8b51d96524ac",
  measurementId: "G-0VHW3DEX5R"
}
firebase.initializeApp(firebaseConfig)

function triggerGoogleSignIn() {
  var provider = new firebase.auth.GoogleAuthProvider()

  return firebase
    .auth()
    .signInWithPopup(provider)
}

function triggerEmailSignIn(email, password) {
  let error = null

  if (email === undefined) error = EMPTY_EMAIL
  if (password === undefined) error = EMPTY_PASSWORD

  const isEmailEmpty = validator.isEmpty(email)
  const isPassEmpty = validator.isEmpty(password)

  if (isEmailEmpty) error = EMPTY_EMAIL
  if (isPassEmpty) error = EMPTY_PASSWORD

  const isEmailValid = validator.isEmail(email)
  if (!isEmailValid) error = INVALID_EMAIL

  if(error !== null) return new Promise((resolve, reject) => {
    reject(error)
  })
  else return firebase.auth().signInWithEmailAndPassword(email, password)
}

function triggerEmailSignUp(email, password, confirmPassword, username) {
  let error = null

  const isEmailEmpty = validator.isEmpty(email)
  const isPassEmpty = validator.isEmpty(password)
  const isConfirmPassEmpty = validator.isEmpty(confirmPassword)
  const isUsernameEmpty = validator.isEmpty(username)

  if (isEmailEmpty) error = EMPTY_EMAIL
  if (isPassEmpty) error = EMPTY_PASSWORD
  if (isConfirmPassEmpty) error = EMPTY_CONFIRM_PASSWORD
  if (isUsernameEmpty) error = EMPTY_USERNAME

  const isEmailValid = validator.isEmail(email)
  if (!isEmailValid) error = INVALID_EMAIL

  const doesPassMatch = validator.equals(password, confirmPassword)
  if (!doesPassMatch) error = PASSWORD_DOES_NOT_MATCH

  if (error !== null)
    return new Promise(( resolve, reject) => {
      reject(error)
    })
  else return firebase.auth().createUserWithEmailAndPassword(email, password)
}

export { triggerEmailSignIn, triggerEmailSignUp, triggerGoogleSignIn, firebase }
