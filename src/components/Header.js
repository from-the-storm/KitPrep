import React from 'react'
import supplies from '../img/supplies.jpg'

const Header = () => (
    <header>
        <div>
            <div>
                <h1>KitPrep</h1>
                <h2>The emergency prep kit preparator.</h2>
            </div>
            <div>
                <img src={supplies} alt="KitPrep" />
            </div>
        </div>
    </header>
)

export default Header