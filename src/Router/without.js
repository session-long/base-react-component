import React from "react";
import PropTypes from 'prop-types'
import { withRouter } from "react-router-dom";

class MyComponent extends React.Component {
    
    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }

    pushRouter(path) {
        this.props.history.push(path);
    }

    render() {
        return null
    }
}

export default withRouter(MyComponent);