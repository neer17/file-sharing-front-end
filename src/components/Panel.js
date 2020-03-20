import React, { Component } from "react"
import {FaImage} from "react-icons/fa"
import {IconContext} from 'react-icons'

import { MyContext } from "./Provider"

class Panel extends Component {

    findFileType = fileType => {
        switch(fileType) {
            case 'image/jpeg':
            case 'image/jpg': return "image"
            case 'application/pdf': return "pdf"
            default: return "file"
        }
    }

  render() {
    const files = this.context.getState().files

    return (
      <div className="panel container">
        {files.length > 0 ? (
          <div>
            {files.map(file => {
              return (
                <div className="panel__container d-flex p-2" key={file.name}>
                  <div className="panel__img p-1 mr-4">
                  {}
                  </div>
                  <div className="panel__filename flex-grow-1 p-1">{file.name}</div>
                  <div className="panel__close-button p-1">&times;</div>
                </div>
              )
            })}
          </div>
        ) : null}
      </div>
    )
  }
}

Panel.contextType = MyContext
export default Panel
