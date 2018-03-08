import React from 'react'
import supplies from '../img/supplies.jpg'

const Header = () => (
    <header>
        <div>
            <div>
                <h1 className="dontPrint">KitPrep</h1>
                <h5 className="printThis">My Emergency Prep Kit</h5>
                <h2 className="dontPrint">The emergency prep kit preparator.</h2>
                <h6 className="printThis">PrepKit.ca</h6>
            </div>
            <div className="image">
                <img src={supplies} alt="KitPrep" />
            </div>
        </div>
    </header>
)

export default Header