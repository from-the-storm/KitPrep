import React from 'react'

const Selector = ({name, handleFormChange, selection, people}) => (
    <div className="selector">
        <label htmlFor={name}>
            {people === 1 ? "person in" : "people in" }
        </label>
        <select
            required
            name={name}
            id={name}
            value={selection}
            aria-label="What city do you live in?"
            onChange={handleFormChange}>
                <option value="" disabled hidden>City name</option>
                <option value="vancouver">Vancouver</option>
                <option value="kelowna">Kelowna</option>
                <option value="richmond">Richmond</option>
        </select>
    </div>
)

export default Selector