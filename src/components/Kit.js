import React, { Component } from 'react'
import Supply from './Supply'

import PropTypes from 'prop-types'
import update from 'immutability-helper'

import fire from '../fire'

let uuid = guid()
let kitRef = fire.database().ref('prepped-kits').child(uuid)

// Generate a (non-compliant) GUID for use as URL and Firebase reference
// Update this when we hit two billion users
function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16).substring(1)
    }
    return 'my-kit-' + s4() + s4() + '-' + s4()
}

class Kit extends Component {

    constructor(props) {
        super(props)
        this.state = ({
            loading: true,
            kitContents: []
        })
        this.addPerishable = this.addPerishable.bind(this)
        this.addNonPerishable = this.addNonPerishable.bind(this)
        
        this.removeSupply = this.removeSupply.bind(this)
        this.updateSupply = this.updateSupply.bind(this)
       
        this.nextId = this.nextId.bind(this)
        this.saveKit = this.saveKit.bind(this)
    }

    componentWillMount() {

        // Assemble the kit
        let kit = require('../basekits/base.json')
        
        let city = this.props.city
        // Avoid loading other files
        city = city.replace('.', '').replace('/', '')
        const cityKit = require('../basekits/cities/' + city + '.json')

        // Add the city-specific kit to the basekit
        kit = kit.concat(cityKit)

        // Add addon kit(s) depending on user's selection
        if (this.props.kids === 'yes') { 
            const kidsKit = require('../basekits/addons/kids.json')
            // Prioritize the youths
            kit = kidsKit.concat(kit)
        }
        if (this.props.pets === 'yes') { 
            const petsKit = require('../basekits/addons/pets.json')
            kit = kit.concat(petsKit)
        }
        if (this.props.home === 'yes') { 
            const homeOwnerKit = require('../basekits/addons/home.json')
            kit = kit.concat(homeOwnerKit)
        }
        if (this.props.vehicle === 'yes') { 
            const vehicleKit = require('../basekits/addons/vehicle.json')
            kit = kit.concat(vehicleKit)
        }
        let baseId = 0;
        for (let item of kit) {
            item.id = 'base-' + baseId++
        }
        this.setState({
            kitContents: kit
        })

        // Set initial state and store it in Firebase
        kitRef.set(kit)

    }

    componentDidMount() {
        // Fake a longer load
        setTimeout(() => 
            this.setState({
                loading: false
            }), 1500)
    }

    saveKit() {
        kitRef.set(this.state.kitContents)
    }

    addPerishable() {
        this.setState(prevState => ({
            kitContents: [
                // use the spread syntax to take all supply items in state and push it into a new array. Then we append new supply.
                // spread syntax allows an iterable such an array to be expanded
                ...prevState.kitContents,
                {
                    id: this.nextId(),
                    name: "",
                    quantity: 1,
                    perishable: true
                }
            ]
        }))
    }

    addNonPerishable() {
        this.setState(prevState => ({
            kitContents: [
                ...prevState.kitContents,
                {
                    id: this.nextId(),
                    name: "",
                    quantity: 1,
                    perishable: false
                }
            ]
        }))
    }

    removeSupply(supplyId) {
        this.setState(prevState => ({
            // filter passes in a supplyId and performs a logical check when the supplyId's id is not equal to the id
            // it will return a new array that has removed the item where this condition is true
            kitContents: prevState.kitContents.filter(item => item.id !== supplyId)
        }))
    }

    updateSupply(supplyId, name, value) {
        const targetIndex = this.state.kitContents.map(function(el) {
            return el.id
        }).indexOf(supplyId)

        this.setState({
            kitContents: update(this.state.kitContents, {[targetIndex]: {[name]: {$set: value}}})
        })
    }

    nextId() {
        this.customId = this.customId || 0
        return 'custom-' + this.customId++
    }
    
    render() {
        const { loading } = this.state
        if (loading) {
            return null
        }

        return (
            <div>
                <h3>Your kit is prepped!</h3>
                <button onClick={this.saveKit}>Save Kit</button>
                <h4>Perishables</h4>
                <table>
                    <thead>
                        <tr>
                            <td>Supply</td>
                            <td>#</td>
                            <td>Expires on</td>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.kitContents.filter(item => item.perishable === true).map(item =>
                        <Supply 
                            // From react docs: We don’t recommend using indexes for keys if the order of items may change. This can negatively impact performance and may cause issues with component state.
                            key={item.id}
                            supplyId={item.id}
                            supplyName={item.name}
                            supplyQuantity={item.quantity * this.props.people}
                            perishable={item.perishable}
                            onRemove={this.removeSupply}
                            onChange={this.updateSupply}
                        />
                    )}
                    </tbody>
                </table>
                <button className="add-supply" onClick={this.addPerishable}>Add supply</button>
                <hr />
                <h4>Non-Perishables</h4>
                <table>
                    <thead>
                        <tr>
                            <td>Supply</td>
                            <td>#</td>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.kitContents.filter(item => item.perishable === false).map(item =>
                        <Supply 
                            key={item.id}
                            supplyId={item.id}
                            supplyName={item.name}
                            supplyQuantity={item.quantity * this.props.people}
                            onRemove={this.removeSupply}
                            onChange={this.updateSupply}
                        />
                    )}
                    </tbody>
                </table>
                <button className="add-supply" onClick={this.addNonPerishable}>Add supply</button>
            </div>
        )
    }
}

Kit.propTypes = {
    people: PropTypes.number,
    city: PropTypes.string,
    kids: PropTypes.string,
    pets: PropTypes.string,
    home: PropTypes.string,
    vehicle: PropTypes.string
}

export default Kit