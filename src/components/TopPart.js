import React from "react"

import Icon from './Icon'

class TopPart extends React.Component {
  render() {
    return (
      <div className="top-part__wrapper">
         <div className="d-flex flex-row">
            <div className="p-2 paper-plane-icon align-self-center">
              <Icon />
            </div>
            <div className="h1 p-2">SHARE</div>
          </div>
        <h2 className="h2-home-page">Share your files</h2>
        <h3 className="h3-home-page">Secure.Safe.Free</h3>
      </div>
    )
  }
}

export default TopPart
