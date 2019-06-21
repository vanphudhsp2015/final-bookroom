import React, { Component } from 'react';
import { Button, Radio } from 'antd';
import { CalenderComponent } from '../../shared/home';
import { connect } from 'react-redux';
import 'antd/dist/antd.css';
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom';
const cookies = new Cookies();
var dateFormatDate = require('dateformat');
const RadioGroup = Radio.Group;
const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};
class SlideBar extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      visible: false,
      rooms: this.props.room.length > 0 ? this.props.room[0].id : '',
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.room !== prevProps.room && !this.state.rooms && this.props.room.length) {
      this.setState({
        rooms: this.props.room[0].id
      })
    }
  }
  showModal = () => {
    if (cookies.get('data') === undefined) {
      this.props.onCheckLogin();
    } else {
      this.setState({
        visible: true
      })
    }
  }
  onChangerSelect = (value) => {
    this.setState({
      rooms: value
    })
  }
  onGetDate = (data) => {
    let dateCurrent = dateFormatDate(data, 'yyyy-mm-dd');
    this.setState({
      dateStart: dateCurrent
    })
    this.props.onGetDate(data);
  }
  onChangeRadio = (e) => {
    this.props.onChangerRoom(e.target.value);
    this.setState({
      value: e.target.value,
    });
  }

  onRedirectForm = () => {
    if (cookies.get('data') === undefined) {
      this.props.onCheckLogin();
    } else {
      this.setState({
        isRedirect: true
      })
    }
  }
  render() {
    if (this.state.isRedirect) {
      return <Redirect to='/new'></Redirect>
    }
    return (
      <div className="b-block-left">
        <div className="b-group-btn">
          <Button className="b-btn waves-effect waves-light" onClick={this.onRedirectForm}>
            TẠO
          </Button>
        </div>
        <CalenderComponent data={this.state.dateStart} onGetDate={this.onGetDate}></CalenderComponent>
        <div className="b-rooms">
          <div className="b-heading text-center">
            <h2 className="b-text-title">
              PHÒNG
            </h2>
          </div>
          <div className="b-form" style={{ textAlign: "left" }}>
            <RadioGroup onChange={this.onChangeRadio} value={this.state.value}>
              <Radio style={radioStyle} value={0}>Tất Cả</Radio>
              {this.props.room.map(data => (
                <div className="b-form-group" key={data.id}>
                  <div className="b-form-check">
                    <Radio style={radioStyle} value={data.id} >{data.attributes.name}</Radio>
                  </div>
                  <div className="b-form-color" style={{ backgroundColor: data.attributes.color }}>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
        <div className="b-page-description">
          <div className="b-heading">
            <h2 className="b-text-title">
              Mô Tả
          </h2>
          </div>
          <div className="b-content">
            <div className="b-content-block">
              <p className="b-text-norm">
                Của Tôi
            </p>
            </div>
            <div className="b-content-right">
              <div className="b-shape">
              </div>
            </div>
          </div>
        </div>
      </div >
    );
  }
}
function mapStateProps(state) {
  return {
    exists_event: state.event.distinct,
    data: state.event.all
  }
}

export default connect(mapStateProps, null)(SlideBar);