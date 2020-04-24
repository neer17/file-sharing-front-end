import React, { Component } from "react"
import { IconContext } from "react-icons"
import { FaPaperPlane } from "react-icons/fa"

export default class Icon extends Component {
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
      "#FFAB40",
    ]

    this.interval = setInterval(() => {
      const randomColor = colors[Math.floor(Math.random() * colors.length)]

      this.setState({
        color: randomColor,
      })
    }, 200)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    return (
      <React.Fragment>
        <IconContext.Provider
          value={{
            color: this.state.color,
            className: "global-class-name",
            size: this.props.size !== undefined ? this.props.size : "30px",
          }}
        >
          <FaPaperPlane />
        </IconContext.Provider>
      </React.Fragment>
    )
  }
}
