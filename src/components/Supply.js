import React, { Component } from 'react'

import PropTypes from 'prop-types'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faTimes from '../fontawesome-pro/fontawesome-pro-regular/faTimes'

class Supply extends Component {

    constructor(props){
        super(props)
        this.state = {
            // Set initial local state of each supply
            name: '',
            quantityOfSupply: 0,
        }
        this.updateSupply = this.updateSupply.bind(this)
        this.removeSupply = this.removeSupply.bind(this)
        this.handleFocus = this.handleFocus.bind(this)
    }

    handleFocus(event) {
        // Select on the number inputs so that it's clearer that they can be edited
        event.target.select()
    }

    componentWillMount() {
        const { supplyName, supplyQuantity } = this.props
        // Set the state from the Kit component's props
        this.setState({
            name: supplyName,
            quantityOfSupply: supplyQuantity
        })
    }

    updateSupply(event) {
        // Update state of supply based on user's input
        const name = event.target.name
        const value = (event.target.type === 'number' && event.target.value) ? parseInt(event.target.value, 10) : event.target.value;
        this.setState({[name]: value})
        // Allow the Kit component to access the changed supply
        this.props.onChange(this.props.supplyId, name, value)
    }

    removeSupply() {
        // Remove the supply from the Kit component
        this.props.onRemove(this.props.supplyId)
    }

    render() {
        const { supplyId } = this.props
        return (
            <tr>
                <td>
                    <input 
                        type="text"
                        name="name"
                        id={supplyId}
                        placeholder="Your supply"
                        value={this.state.name}
                        onChange={this.updateSupply}
                    />
                    <label htmlFor={supplyId}>Supply</label>
                </td>
                <td>
                    <input 
                        type="number"
                        name="quantityOfSupply"
                        min="1"
                        max="999"
                        step="1"
                        id={'q-' + supplyId}
                        onFocus={this.handleFocus}
                        placeholder="#"
                        value={this.state.quantityOfSupply}
                        onChange={this.updateSupply}
                    />
                    <label htmlFor={'q-' + supplyId}>Quantity of Supply</label>
                </td>
                {
                // if the supply is perishable create an additional column
                this.props.perishable &&
                <td>
                    <input 
                        type="date"
                        name="dateOfExpiry"
                        value={this.state.dateOfExpiry}
                        onChange={this.updateSupply}
                        id={'e-' + supplyId}
                    />
                    <label htmlFor={'e-' + supplyId}>Supply Expiry</label>
                </td>
                }
                <td>
                    <button aria-label="Delete Supply" className="del" onClick={this.removeSupply}><FontAwesomeIcon icon={faTimes} /></button>
                </td>
            </tr>
        )
    }
}

Supply.propTypes = {
    supplyName: PropTypes.string,
    supplyQuantity: PropTypes.number,
}

export default Supply