import React, {Component} from 'react'

class Authentication extends Component {
    componentDidMount() {
        localStorage.clear()
    }

    render() {
        return (
            <div className={"col col-md-6"} style={{
                'color': '#ffffff'
            }}>
                <div><h1>Share'em all.</h1></div>
                <h2>Now, share files without worrying about their extensions directly to the inbox</h2>
            </div>
        )
    }
}

export default Authentication