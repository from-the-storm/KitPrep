import React, { Component } from 'react'

import PropTypes from 'prop-types'

class Number extends Component {

    handleFocus(event) {
        event.target.select()
    }

    render() {
        return (
            <div className="number">
                <label htmlFor={this.props.name}>{this.props.directions}</label>
                <input
                name="people"
                type="number"
                required
                aria-label="Number of people we're prepping for"
                value={this.props.selection}
                min="1"
                max="99"
                onFocus={this.handleFocus}
                onChange={this.props.handleFormChange}
                />
            </div>

        )
    }
}

Number.propTypes = {
    name: PropTypes.string,
    directions: PropTypes.string,
    selection: PropTypes.number,
    handleFormChange: PropTypes.func
}

export default Number