import React, { Component } from 'react';
import Calendar from 'react-calendar';

class CalenderComponent extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            date: new Date()
        }
    }
    onChange = (date) => { 
        this.props.onGetDate(date)
     }
    render() {
        return (
            <div className="b-calender">
                <Calendar
                    onChange={this.onChange}
                    value={this.state.date}
                />
            </div>
        );
    }
}

export default CalenderComponent;