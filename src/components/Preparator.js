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
            prepped: false,
            // Form variables
            people: 1,
            city: '',
            days: 3,
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
        this.handleSave = this.handleSave.bind(this)
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
        this.setState({
            reset: true
        })
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

    handleSave() {
        this.setState({
            saved: true
        })
    }
  
    render() {
        // Check to see if all form elements are filled in
        const { people, city, kids, pets, home, vehicle } = this.state
        let enablePartTwo = false
        let enableSubmit = false
        if (people > 0 && city) {
            enablePartTwo = true
        }
        if (enablePartTwo && kids && pets && home && vehicle) {
            enableSubmit = true
        }
        return(
            <div>
                <Header />
                <section id="prep">
                    <div>
                        <form onSubmit={this.handleSubmit}>
                            {!this.state.prepped &&
                                // Don't render the form if there's a prepped kit
                                <div>
                                    <div id="one" className="step">
                                        <fieldset>
                                            <Number directions="Prep my kit for" min={1} max={24} name="people" selection={this.state.people} handleFormChange={this.handleFormChange} />
                                            <Selector people={this.state.people} name="city" selection={this.state.city} handleFormChange={this.handleFormChange} />
                                            <Number directions="for" min={3} max={14} name="days" selection={this.state.days} handleFormChange={this.handleFormChange} /><span>days.</span>
                                        </fieldset>
                                    </div>
                                    <div id="two" className={enablePartTwo ? 'step clear' : 'step blurred'}>
                                        <fieldset disabled={!enablePartTwo}>
                                            <legend>Customize</legend>
                                            <YesNo question="Do you have young kids?" name="kids" selection={this.state.kids} handleFormChange={this.handleFormChange} />
                                            <YesNo question="Own any pets?" name="pets" selection={this.state.pets} handleFormChange={this.handleFormChange} />
                                            <YesNo question="Got a vehicle?" name="vehicle" selection={this.state.vehicle} handleFormChange={this.handleFormChange} />
                                            <YesNo question="Own your home?" name="home" selection={this.state.home} handleFormChange={this.handleFormChange} />
                                        </fieldset>                 
                                    </div>
                                </div>
                            }
                            <div id="controls" className={this.state.prepped ? 'striped' : ''}>
                                <button 
                                    type="submit" 
                                    className={this.state.prepped ? 'hide' : 'show'}
                                    disabled={!enableSubmit}>
                                    Prep my kit
                                </button>
                                <button 
                                    onClick={this.handleReset}
                                    type="submit"
                                    className={this.state.prepped ? 'show' : 'hide'}
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
                                onClick={this.handleSave}
                                reset={this.state.reset}
                                saved={this.state.saved}
                                people={parseInt(this.state.people, 10)}
                                days={parseInt(this.state.days, 10)}
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