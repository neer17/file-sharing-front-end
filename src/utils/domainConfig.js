const production = process.env.REACT_APP_PRODUCTION

//  URL of backend
console.info('upload.js production: ', process.env.REACT_APP_PRODUCTION, 'type: ', typeof production)
const url = production === 'true' ? 'https://file-sharing-app-back-end.herokuapp.com' : 'http://localhost:3003'
export {url}