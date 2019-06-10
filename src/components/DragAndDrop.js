import React, {Component} from 'react';

class DragAndDrop extends Component {
    state = {drag: false}
    dropRef = React.createRef()

    handleDrag = (e) => {
        console.log('handle drag called')
        e.preventDefault()
        e.stopPropagation()

        //  getting the image and changing its visibility none
        let dragImage = document.getElementById("drag_image_id")
        dragImage.style.display = 'none'
    }

    handleDragIn = (e) => {
        console.log('handle drag in called')
        e.preventDefault()
        e.stopPropagation()

        //  getting the image and changing its visibility to none
        let dragImage = document.getElementById("drag_image_id")
        dragImage.style.display = 'none'

        //  this would be incremented when files are dragged in
        this.dropCounter++
        //  checking if drag contains any files
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            this.setState({drag: true})
        }
    }

    handleDragOut = (e) => {
        console.log('handle drag out')
        e.preventDefault()
        e.stopPropagation()

        //  getting the image and changing its visibility to block
        let dragImage = document.getElementById("drag_image_id")
        dragImage.style.display = 'block'

        //  decrementing the dropCounter on drag out
        this.dropCounter--
        if (this.dragCounter === 0) {
            this.setState({drag: false})
        }
    }

    handleDrop = (e) => {
        console.log('handle drop')
        e.preventDefault()
        e.stopPropagation()

        //  checking if drag has any files, if it has then clearing data from the drag
        //  and re-setting the "dragCounter"
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            e.dataTransfer.clearData()
            this.dragCounter = 0

            /*//  this would be passed as a prop at the time of using this class
            //  passing all the files
            this.props.handleDrag(e.dataTransfer.files)*/
        }
    }

    componentDidMount() {
        let div = this.dropRef.current
        div.addEventListener('dragenter', this.handleDragIn)
        div.addEventListener('dragleave', this.handleDragOut)
        div.addEventListener('dragover', this.handleDrag)
        div.addEventListener('drop', this.handleDrop)
    }

    componentWillUnmount() {
        let div = this.dropRef.current
        div.removeEventListener('dragenter', this.handleDragIn)
        div.removeEventListener('dragleave', this.handleDragOut)
        div.removeEventListener('dragover', this.handleDrag)
        div.removeEventListener('drop', this.handleDrop)
    }

    render() {
        return (
            <div
                className={"flex flex-row"}
                ref={this.dropRef}
            >
                {this.state.drag &&
                <div
                    style={{
                        border: 'dashed grey 4px',
                        backgroundColor: 'rgba(255,255,255,.8)',
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 9999
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            right: 0,
                            left: 0,
                            textAlign: 'center',
                            color: 'grey',
                            fontSize: 20
                        }}
                    >
                        <small>drop here :)</small>
                    </div>
                </div>
                }
                {/* rendering the children here */}
                {this.props.children}
            </div>
        );
    }
}

export default DragAndDrop
