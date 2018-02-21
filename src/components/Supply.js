import React, { Component } from 'react'

import PropTypes from 'prop-types'

class Supply extends Component {

    constructor(props){
        super(props)
        this.state = {
            nameOfSupply: '',
            quantityOfSupply: 0,
        }
        this.handleSupplyChange = this.handleSupplyChange.bind(this)
        this.removeSupply = this.removeSupply.bind(this)
        this.handleFocus = this.handleFocus.bind(this)
    }

    handleFocus(event) {
        event.target.select()
    }

    componentWillMount() {
        const { supplyName, supplyQuantity, daysUntilExpiry } = this.props
        let expiryDate

        if (daysUntilExpiry === 0) {
            expiryDate = ''
        }
        else {
            let theDate = new Date()
            theDate.setDate(theDate.getDate() + daysUntilExpiry)
            expiryDate = theDate.getFullYear() + '-' + ('0' + (theDate.getMonth()+1)).slice(-2) + '-' + ('0' + theDate.getDate()).slice(-2)
        }

        this.setState({
            nameOfSupply: supplyName,
            quantityOfSupply: supplyQuantity,
            dateOfExpiry: expiryDate
        })
    }

    handleSupplyChange(event) {
        const name = event.target.name
        const value = (event.target.type === 'number' && event.target.value) ? parseInt(event.target.value, 10) : event.target.value;
        this.setState({[name]: value})
    }

    removeSupply() {
        this.props.onRemove(this.props.supplyId)
    }

    render() {

        return (
            <div className="supply-row">
                <div className="supply-name">
                    <input 
                        type="text"
                        name="nameOfSupply"
                        placeholder="Your supply"
                        value={this.state.nameOfSupply}
                        onChange={this.handleSupplyChange}
                    />
                </div>
                <div>
                    <input 
                        type="number"
                        name="quantityOfSupply"
                        min="1"
                        max="999"
                        step="1"
                        onFocus={this.handleFocus}
                        placeholder="#"
                        value={this.state.quantityOfSupply}
                        onChange={this.handleSupplyChange}
                    />
                </div>
                {this.props.daysUntilExpiry &&
                <div>
                    <input 
                        type="date"
                        name="dateOfExpiry"
                        value={this.state.dateOfExpiry}
                        onChange={this.handleSupplyChange}
                    />
                </div>
                }
                <div>
                    <button className="del" onClick={this.removeSupply}>X</button>
                </div>
            </div>
        )
    }
}

Supply.propTypes = {
    supplyName: PropTypes.string,
    supplyQuantity: PropTypes.number,
    daysUntilExpiry: PropTypes.number
}

export default Supply