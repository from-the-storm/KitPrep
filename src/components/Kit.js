import React, { Component } from 'react'
import Supply from './Supply'

import PropTypes from 'prop-types'
import update from 'immutability-helper'

import fire from '../fire'

import { Link } from 'react-router-dom'

let uuId = ''
let kitRef = ''
let kitId = ''

class Kit extends Component {

    constructor(props) {
        super(props)
        this.state = ({
            loading: true,
            kitContents: []
        })
        this.addSupply = this.addSupply.bind(this)
        
        this.removeSupply = this.removeSupply.bind(this)
        this.updateSupply = this.updateSupply.bind(this)
       
        this.nextId = this.nextId.bind(this)
        this.saveKit = this.saveKit.bind(this)
    }

    componentWillMount() {
        // If the Preparator component found a matching kit ID on Firebase
        if (this.props.saved && this.props.reset) {
            // If it's been saved and reset, reset the kit object
            this.setState({kitContents: []})
        }
        else if (this.props.saved) {
            kitId = window.location.pathname.substr(1)
            kitRef = fire.database().ref('prepped-kits').child(kitId)
            return fire.database().ref('prepped-kits/' + kitId).once('value').then((snapshot) => {
                const savedKitContents = snapshot.val() || undefined
                if (savedKitContents) {
                    // Set the contents of the Firebase ref to kitContents' state
                    this.setState({
                        kitContents: savedKitContents
                    })
                }
            })
        }
        // If no matching kit was found
        if (!this.props.saved) {
            // Generate a (non-compliant) GUID for use as a reference in Firebase.
            // TODO: Make this more reliable when we hit two billion users.
            uuId = guid()
            kitRef = fire.database().ref('prepped-kits').child(uuId)
            function guid() {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
                }
                return 'my-kit-' + s4() + s4() + '-' + s4()
            }
        }

        // Assemble the base kit
        let kit = require('../basekits/base.json')
            
        // Get the user-selected city
        let city = this.props.city

        // Avoid loading other files
        city = city.replace('.', '').replace('/', '')

        // Add on the city's kit
        const cityKit = require('../basekits/cities/' + city + '.json')
        kit = kit.concat(cityKit)

        // Add addon kit(s) depending on user's selection
        if (this.props.kids === 'yes') { 
            const kidsKit = require('../basekits/addons/kids.json')
            // Prioritize the youths by adding them first
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

        // Generate a unique supply ID
        let baseId = 0;
        for (let item of kit) {
            item.id = 'base-' + baseId++
        }

        // Set state to kit object
        this.setState({
            kitContents: kit
        })
    }

    componentDidMount() {
        // Fake a longer load for demo
        setTimeout(() => 
            this.setState({
                loading: false
            }),
        1500)
    }

    saveKit() {
        // Save or update the kit in Firebase
        kitRef.set(this.state.kitContents)
        // Let Preparator know that it's saved
        this.props.onClick()      
    }

    addSupply(event) {
        // Add a new perishable or nonperishable supply
        const supplyType = event.target.id === 'perishable' ? true : false
        this.setState(prevState => ({
            // Append the new supply
            kitContents: [
                ...prevState.kitContents,
                {
                    id: this.nextId(),
                    name: "",
                    quantity: 1,
                    perishable: supplyType
                }
            ]
        }))
    }

    removeSupply(supplyId) {
        this.setState(prevState => ({
            // Filter passes in a supplyId and performs a logical check when the supplyId's id is not equal to the id
            // It will return a new array that has removed the item where this condition is true
            kitContents: prevState.kitContents.filter(item => item.id !== supplyId)
        }))
    }

    updateSupply(supplyId, name, value) {
        // Find the index of the supply that's been updated
        const targetIndex = this.state.kitContents.map(function(el) {
            return el.id
        }).indexOf(supplyId)

        // Update the kitContents object
        this.setState({
            kitContents: update(this.state.kitContents, {[targetIndex]: {[name]: {$set: value}}})
        })
    }

    nextId() {
        // For supplies that the user adds, generate a unique ID
        this.customId = this.customId || 0
        return 'custom-' + this.customId++
    }
    
    render() {
        const loading = this.state.loading
        if (loading) {
            // Display the loading spinner using the CSS :empty selector
            return null
        }

        return (
            <div>
                <h3>Your kit is prepped!</h3>
                {
                !this.props.saved ? 
                    // If there's no savedKit, link to it to update the route
                    <Link to={{ pathname: '/' + uuId }} onClick={this.saveKit} className="save">Save Kit</Link> : 
                    // Otherwise just update it
                    <button onClick={this.saveKit} className="save">Save Kit</button>
                }
                {
                // If there's a saved kit, display the link to it
                this.props.saved && 
                    <p>Your Kit is saved to <code><Link to={{ pathname: '/' + window.location.pathname.substr(1) }}>kitprep.ca/{window.location.pathname.substr(1)}</Link></code></p>
                }
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
                    {
                    // Map the perishables
                    this.state.kitContents.filter(item => item.perishable === true).map(item =>
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
                <button className="add-supply" id="perishable" onClick={this.addSupply}>Add supply</button>
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
                    {
                    // Map the nonperishables
                    this.state.kitContents.filter(item => item.perishable === false).map(item =>
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
                <button className="add-supply" id="nonperishable" onClick={this.addSupply}>Add supply</button>
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