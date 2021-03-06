import React, { Component } from 'react';
import Calendar from 'react-calendar';
import PropTypes from 'prop-types';
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
          locale={'vi'}
          onChange={this.onChange}
          value={this.state.date}
          activeStartDate={this.state.date}
        />
      </div>
    );
  }
}
CalenderComponent.propTypes = {
  onGetDate: PropTypes.func,
}
export default CalenderComponent;
