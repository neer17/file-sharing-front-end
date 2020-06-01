import React, { Component } from "react"

import { IconContext } from "react-icons"
import { AiOutlineGithub } from "react-icons/ai"

export default class Settings extends Component {
  render() {
    return (
      <div className="settings__panel d-flex flex-column">
        <button className="btn btn-block btn-primary mb-2" onClick={this.props.logout}>
          Logout
        </button>
        <div className="settings__github align-self-center">
          <IconContext.Provider
            value={{
              color: "grey",
              className: "global-class-name",
              size: "2rem",
            }}
          >
            <a href={process.env.REACT_APP_GITHUB_WIKI}>
              <AiOutlineGithub />
            </a>

          </IconContext.Provider>
        </div>
      </div>
    )
  }
}
