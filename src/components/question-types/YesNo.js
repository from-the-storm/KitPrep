import React from 'react'

const YesNo = ({name, handleFormChange, question, selection}) => (
    <div className="yes-no">
        <fieldset>
            <legend>{question}</legend>
            <div className="radio">
                <input 
                    // required
                    name={name}
                    type="radio"
                    id={name + 'Yes'}
                    value="yes"
                    checked={selection === "yes"}
                    onChange={handleFormChange}
                />
                <label htmlFor={name + 'Yes'}>Yes</label>
            </div>
            <div className="radio">
                <input 
                    // required
                    name={name}
                    type="radio"
                    id={name + 'No'}
                    value="no"
                    checked={selection === "no"}
                    onChange={handleFormChange}
                />
                <label htmlFor={name + 'No'}>No</label>
            </div>
        </fieldset>
    </div>
)

export default YesNo