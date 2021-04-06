const production = process.env.REACT_APP_PRODUCTION

//  URL of backend
// console.info('upload.js production: ', process.env.REACT_APP_PRODUCTION, 'type: ', typeof production)
const url = production === 'true' ? process.env.REACT_APP_BACKEND_URL : 'http://localhost:3003'
export {url}