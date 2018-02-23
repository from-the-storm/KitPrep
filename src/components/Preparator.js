import React, { Component } from 'react'

import Header from './Header'
import Footer from './Footer'

import ErrorBoundary from './ErrorBoundary'
import Kit from './Kit'
import Number from './question-types/Number'
import Selector from './question-types/Selector'
import YesNo from './question-types/YesNo'

import fire from '../fire'

class Preparator extends Component {
    
    constructor(props) {
        super(props)
        this.state = ({
            // If a kit already exists at the current path
            saved: false,
            // If the user has filled in the form
            prepped: false,
            // Form variables
            people: 1,
            city: '',
            kids: undefined,
            pets: undefined,
            home: undefined,
            vehicle: undefined
        })
        // Capture initial state
        this.startingPoint = this.state

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleFormChange = this.handleFormChange.bind(this)
        this.handleReset = this.handleReset.bind(this)
    }

    componentWillMount() {
        const kitId = window.location.pathname
        // Check if we're not on the home page
        if (kitId !== '/') {
            return fire.database().ref('prepped-kits/' + kitId).once('value').then((snapshot) => {
                const savedKit = snapshot.val() || undefined
                // If there's an existing kit in Firebase
                if (savedKit) {
                    this.setState({
                        saved: true,
                        prepped: true
                    })
                }
            })
        }
    }

    handleReset(event) {
        this.setState(this.startingPoint)
        event.preventDefault()
    }

    handleSubmit(event) {
        // If the submit button is enabled and clicked we can set state to prepped.
        this.setState({
            prepped: true
        })
        // Prevent default because it's a form submission
        event.preventDefault()
    }

    handleFormChange(event) {
        // Whenever a form element changes we change the corresponding value in state.
        const name = event.target.name
        const value = (event.target.type === 'number' && event.target.value) ? parseInt(event.target.value, 10) : event.target.value
        this.setState({[name]: value})
    }
   
    render() {
        // Check to see if all form elements are filled in
        // const { people, city, kids, pets, home, vehicle } = this.state
        const enablePartTwo = true
            // people > 0 &&
            // city
        const enableSubmit = true
            // enablePartTwo &&
            // kids &&
            // pets &&
            // home &&
            // vehicle
        return(
            <div>
                <Header />
                <section id="prep">
                    <div>
                        <form onSubmit={this.handleSubmit}>
                            <div id="one" className="step">
                                <fieldset disabled={this.state.prepped}>
                                    <Number directions="Prep my kit for" name="people" selection={this.state.people} handleFormChange={this.handleFormChange} />
                                    <Selector people={this.state.people} name="city" selection={this.state.city} handleFormChange={this.handleFormChange} />
                                </fieldset>
                            </div>
                            <div id="two" className={enablePartTwo ? 'step clear' : 'step blurred'}>
                                <fieldset disabled={!enablePartTwo || this.state.prepped}>
                                    <legend>Customize</legend>
                                    <YesNo question="Do you have young kids?" name="kids" selection={this.state.kids} handleFormChange={this.handleFormChange} />
                                    <YesNo question="Own any pets?" name="pets" selection={this.state.pets} handleFormChange={this.handleFormChange} />
                                    <YesNo question="Got a vehicle?" name="vehicle" selection={this.state.vehicle} handleFormChange={this.handleFormChange} />
                                    <YesNo question="Own your home?" name="home" selection={this.state.home} handleFormChange={this.handleFormChange} />
                                </fieldset>                 
                            </div>
                            <div id="buttons">
                                <button 
                                    type="submit" 
                                    className={this.state.prepped ? 'prepper hide' : 'prepper show'}
                                    disabled={!enableSubmit}>
                                    Prep my kit
                                </button>
                                <button 
                                    onClick={this.handleReset}
                                    type="submit"
                                    className={this.state.prepped ? 'prepper show' : 'prepper hide'}
                                    disabled={!this.state.prepped}>
                                    Reset my kit
                                </button>
                            </div>            
                        </form>
                    </div>
                </section>
                {this.state.prepped &&
                <section id="kit">
                    <div id="prepped">
                        <ErrorBoundary>
                            <Kit
                                saved={this.state.saved}
                                people={parseInt(this.state.people, 10)}
                                city={this.state.city}
                                kids={this.state.kids}
                                pets={this.state.pets}
                                home={this.state.home}
                                vehicle={this.state.vehicle}
                            />
                        </ErrorBoundary>
                    </div>
                </section>
                }
                <Footer />
            </div>
        )
    }
}

export default Preparator