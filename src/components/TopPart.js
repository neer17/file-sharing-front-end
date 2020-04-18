import React from "react"
import { IconContext } from "react-icons"
import { FaPaperPlane } from 'react-icons/fa'

function TopPart(props) {
  return (
   
      <div className="top-part__wrapper">
        <IconContext.Provider
          value={{ color: "blue", className: "global-class-name", size: "30px"}}
        >
          <div className="d-flex flex-row">
          <div className="p-2 paper-plane-icon">
            <FaPaperPlane />
          </div>
        <div className="h1 p-2">SHARE</div>

          </div>
        </IconContext.Provider>
        <h2 className="h2-home-page">Share your files</h2>
        <h3 className="h3-home-page">Secure.Safe.Free</h3>
      </div>
  )
}

export default TopPart
