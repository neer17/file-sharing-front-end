import React from "react"
import { IconContext } from "react-icons"
import { FaPaperPlane } from "react-icons/fa"

class TopPart extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      color: null,
    }
  }

  componentDidMount() {
    const colors = [
      "#FF5252",
      "#FF4081",
      "#E040FB",
      "#7C4DFF",
      "#536DFE",
      "#448AFF",
      "#40C4FF",
      "#18FFFF",
      "#64FFDA",
      "#69F0AE",
      "#B2FF59",
      "#EEFF41",
      "#FFFF00",
      "#FFD740",
      "#FFAB40"
    ]
    setInterval(() => {
      const randomColor = colors[Math.floor(Math.random() * colors.length)]
      this.setState({
        color: randomColor,
      })
    }, 200)
  }

  render() {
    return (
      <div className="top-part__wrapper">
        {this.icon()}
        <h2 className="h2-home-page">Share your files</h2>
        <h3 className="h3-home-page">Secure.Safe.Free</h3>
      </div>
    )
  }

  icon = () => {
    return (
      <React.Fragment>
        <IconContext.Provider
          value={{
            color: this.state.color,
            className: "global-class-name",
            size: "30px",
          }}
        >
          <div className="d-flex flex-row">
            <div className="p-2 paper-plane-icon align-self-center">
              <FaPaperPlane />
            </div>
            <div className="h1 p-2">SHARE</div>
          </div>
        </IconContext.Provider>
      </React.Fragment>
    )
  }
}

export default TopPart
