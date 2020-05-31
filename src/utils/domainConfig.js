const production = process.env.REACT_APP_PRODUCTION

//  URL of backend
const url = production ? 'https://file-sharing-app-back-end.herokuapp.com' : 'http://localhost:3003'
export {url}