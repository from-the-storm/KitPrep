import * as React from 'react'

interface Props {
    name: string,
    directions: string,
    min: number,
    max: number,
    selection: number,
    // It's like the opposite of `any` - the absence of any type at all. You may see this as the return type of functions that do not return a value
    handleFormChange: () => void
}

export class Number extends React.Component<Props> {

    // When we reference props, it has to match the Props interface
    constructor(props: Props) {
        super(props)
    }

    public render() {
        return (
            <div className="number">
                <label htmlFor={name}>{this.props.directions}</label>
                <input
                name={this.props.name}
                id={this.props.name}
                type="number"
                required={true}
                aria-label="Number of people we're prepping for"
                value={this.props.selection}
                min={this.props.min}
                max={this.props.max}
                onFocus={this.handleFocus}
                onChange={this.props.handleFormChange}
                />
            </div>
        )
    }

    // The type here is a React ChangeEvent
    private handleFocus(event: React.ChangeEvent<HTMLInputElement>) {
        event.target.select()
    }

}