import React, { Component } from 'react'

import { Header } from './Header'
import { Footer } from './Footer'

import ErrorBoundary from './ErrorBoundary'
import Kit from './Kit'
import { Number } from './question-types/Number'
import { Selector } from './question-types/Selector'
import { YesNo } from './question-types/YesNo'

import Modal from 'react-responsive-modal'

import fire from '../fire'

/* tslint:disable */

class Preparator extends Component {
    
    constructor(props) {
        super(props)
        this.state = ({
            prepped: false,
            loaded: false,
            // Form variables
            people: 1,
            city: '',
            days: 3,
            kids: undefined,
            pets: undefined,
            home: undefined,
            vehicle: undefined,
            // Modal state
            open: false,
        })
        // Capture initial state
        this.startingPoint = this.state

        // In JavaScript, class methods are not bound by default. (Binding creates a new function that, when, called, has its `this` keyword set to the provided value.)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleFormChange = this.handleFormChange.bind(this)
        this.handleReset = this.handleReset.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleKitLoaded = this.handleKitLoaded.bind(this)
    }

    componentWillMount() {
        const kitId = window.location.pathname
        // Check if we're not on the home page
        if (kitId !== '/') {
            // If not, check Firebase for a matching saved kit
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
        window.scrollTo(0, 0)
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

    handleKitLoaded() {
        this.setState({
            loaded: true
        })
    }

    onOpenModal = () => {
        this.setState({ open: true });
    };
    
    onCloseModal = () => {
        this.setState({ open: false });
    };
  
    render() {
        // Check to see if all form elements are filled in
        const { people, city, kids, pets, home, vehicle, days, open } = this.state
        let enablePartTwo = false
        let enableSubmit = false
        if (people > 0 && city && days > 0) {
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
                                            <legend>How many people, how many days, and in what city are we preparing for?</legend>
                                            <Number directions="Prep my kit for" min={1} max={24} name="people" selection={this.state.people} handleFormChange={this.handleFormChange} />
                                            <Selector people={this.state.people} name="city" selection={this.state.city} handleFormChange={this.handleFormChange} />
                                            <Number directions="for" min={1} max={14} name="days" selection={this.state.days} handleFormChange={this.handleFormChange} /><span>days.</span>
                                        </fieldset>
                                    </div>
                                    <div id="two" className={enablePartTwo ? 'step clear' : 'step blurred'}>
                                        <fieldset disabled={!enablePartTwo}>
                                            <legend>Customize your kit</legend>
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
                                {this.state.loaded &&
                                <button
                                    onClick={this.onOpenModal}
                                    className={this.state.prepped ? 'show reset' : 'hide'}
                                    disabled={!this.state.prepped}>
                                    Reset my kit
                                </button>
                                }
                            </div>            
                        </form>
                    </div>
                </section>
                {this.state.prepped &&
                <section id="kit">
                    <div id="prepped">
                        <ErrorBoundary>
                            <Kit
                                loaded={this.handleKitLoaded}
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
                <Modal 
                    open={open}
                    onClose={this.onCloseModal}
                    classNames={{
                        overlay: 'confirm-reset-overlay',
                        modal: 'confirm-reset',
                    }}
                    showCloseIcon={false}
                >
                    <h2>Are you sure you want to reset your kit?</h2>
                    <div className="reset-controls">
                        <button
                            onClick={this.onCloseModal}
                            type="submit">
                                No
                        </button>
                        <button
                            className="reset"
                            onClick={this.handleReset}
                            type="submit">
                                Yes
                        </button>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default Preparator