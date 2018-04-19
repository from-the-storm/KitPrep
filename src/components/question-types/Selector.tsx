import * as React from 'react'

interface Props {
    name: string,
    selection: 'vancouver' | 'kelowna' | 'richmond',
    people: number,
    // Type of functions that don't return a value
    handleFormChange: () => void
}

// In stateless functional components you do not need the `this` keyword, nor do you have access to  refs.
export const Selector: React.SFC<Props> = ({name, selection, people, handleFormChange}) => {
    return (
        <div className="selector">
            <label htmlFor={name}>
                {people === 1 ? "person in" : "people in" }
            </label>
            <select
                required={true}
                name={name}
                id={name}
                value={selection}
                aria-label="What city do you live in?"
                onChange={handleFormChange}>
                    <option value="" disabled={true} hidden={true}>City name</option>
                    <option value="vancouver">Vancouver</option>
                    <option value="kelowna">Kelowna</option>
                    <option value="richmond">Richmond</option>
            </select>
        </div>
    )
}