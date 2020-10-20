import React, { Component } from "react"

export default class Carousel extends Component {
  render() {
    return (
      <div className="carousel-div ">
        <div id="demo" className="carousel slide" data-ride="carousel">
          {/* <!-- Indicators --> */}
          <ul className="carousel-indicators">
            <li data-target="#demo" data-slide-to="0" className="active"></li>
            <li data-target="#demo" data-slide-to="1"></li>
            <li data-target="#demo" data-slide-to="2"></li>
          </ul>

          {/* <!-- The slideshow --> */}
          <div className="carousel-inner">
            <div className="carousel-item active" id="carousel-item">
              <picture className="picture-container">
                <img
                  className="authentication-img"
                  src={require("./../images/sample-1.jpg")}
                />
              </picture>
            </div>
            <div className="carousel-item" id="carousel-item">
              <picture className="picture-container">
                <img
                  className={"authentication-img"}
                  src={require("./../images/sample-2.jpg")}
                />
              </picture>
            </div>
            <div className="carousel-item" id="carousel-item">
              <picture className="picture-container">
                <img
                  className={"authentication-img"}
                  src={require("./../images/sample-3.jpg")}
                />
              </picture>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
