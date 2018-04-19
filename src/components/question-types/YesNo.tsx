import * as React from 'react'

interface Props {
    name: string,
    selection: 'yes' | 'no',
    question: string,
    // Type of functions that don't return a value
    handleFormChange: () => void
}

export const YesNo: React.SFC<Props> = ({name, selection, question, handleFormChange}) => (
    <div className="yes-no">
        <fieldset>
            <legend>{question}</legend>
            <div className="radio">
                <input 
                    required={true}
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
                    required={true}
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