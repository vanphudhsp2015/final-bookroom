import React, { Component } from 'react';
import { Modal, Button, DatePicker, TimePicker, Checkbox, Select, Radio } from 'antd';
import { CalenderComponent } from '../../shared/home';
import { connect } from 'react-redux'
import moment from 'moment';
import 'antd/dist/antd.css';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
var dateFormatDate = require('dateformat');
const format = 'HH:mm';
const dateFormat = 'YYYY-MM-DD';
var now = new Date()
const Option = Select.Option;
const RadioGroup = Radio.Group;
const children = [
  { id: '1', name: 'su' },
  { id: '2', name: 'mo' },
  { id: '3', name: 'tu' },
  { id: '4', name: 'we' },
  { id: '5', name: 'th' },
  { id: '6', name: 'fr' },
  { id: '7', name: 'sa' }
];
const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};
function disabledHours() {
  return [0, 1, 2, 3, 4, 5, 6, 7, 12, 18, 19, 20, 21, 22, 23, 24];
}
class SlideBar extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      visible: false,
      calender: [],
      title: 'Đặt Phòng Mới',
      dateStart: dateFormatDate(now, 'yyyy-mm-dd'),
      rooms: this.props.room.length > 0 ? this.props.room[0].id : '',
      timestart: '08:30',
      timeend: '09:30',
      checkbox: false,
      byweekday: ['su', 'mo'],
      count: 1,
      choice: 'daily',
      value: 0,
      formErrors: { title: '' },
      titleValid: false,
    }
  }
  validateField = (fieldName, value) => {
    let fieldValidationErrors = this.state.formErrors;
    let titleValid = this.state.titleValid;
    switch (fieldName) {
      case "title":
        titleValid = value.length >= 6;
        fieldValidationErrors.title = titleValid ? '' : ' Vui Lòng Điền Hơn  6 Ký Tự';
        break;
      default:
        break;
    }
    this.setState({
      formErrors: fieldValidationErrors,
      titleValid: titleValid,
    }, this.validateForm);
  }
  validateForm = () => {
    if (this.state.titleValid) {
      this.setState({ formValid: this.state.titleValid })

    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.edit !== this.props.edit) {
      let data = this.props.dataEdit.attributes;
      this.setState({
        id: this.props.dataEdit.id,
        visible: this.props.edit,
        title: data.content,
        rooms: data.room.id,
        dateStart: dateFormatDate(data.daystart, 'yyyy-mm-dd'),
        timestart: data.timestart,
        timeend: data.timeend,
        checkbox: data.repeat === null ? false : true,
        choice: data.repeat === null ? 'daily' : data.repeat.repeatby,
        count: data.repeat === null ? 1 : data.repeat.count,
        byweekday: data.repeat === null ? ['su', 'mo'] : data.repeat.byweekday
      })
    }
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
  handleOk = (e) => {
    this.onReset();
  }

  handleCancel = () => {
    this.onReset();
    this.props.onCancleEdit();
  }
  onChanger = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value },
      () => { this.validateField(name, value) });
  }
  onChangerTime = (value) => {
    this.setState({
      duration: value._i
    })
  }
  onChangerSelect = (value) => {
    this.setState({
      rooms: value
    })
  }
  onChangeTime = (time, timeString) => {
    if (timeString >= this.state.timeend) {
      this.setState({
        timestart: timeString,
        timeend: timeString
      })
    } else {
      this.setState({
        timestart: timeString,
        timeend: timeString
      })
    }
  }
  onChangeTimeItem = (date, dateString) => {
    this.setState({
      timeend: dateString
    })
  }
  onChangerCheck = (e) => {
    this.setState({
      checkbox: e.target.checked
    })

  }
  handleChange = (value) => {
    this.setState({
      byweekday: value
    })
  }
  onGetDate = (data) => {
    let dateCurrent = dateFormatDate(data, 'yyyy-mm-dd');
    this.setState({
      dateStart: dateCurrent
    })
    this.props.onGetDate(data);
  }
  onReset() {
    this.setState({
      visible: false,
      calender: [],
      title: 'Đặt Phòng Mới',
      dateStart: dateFormatDate(now, 'yyyy-mm-dd'),
      rooms: this.props.room.length > 0 ? this.props.room[0].id : '',
      timestart: '08:30',
      timeend: '09:30',
      checkbox: false,
      byweekday: ['su', 'mo'],
      count: 1,
      choice: 'daily',
      value: 0,
      formErrors: { title: '' },
      titleValid: false,
    })
  }
  onChange = (date, dateString) => {
    this.setState({
      dateStart: dateString
    })
  }
  onChangeRadio = (e) => {
    this.props.onChangerRoom(e.target.value);
    this.setState({
      value: e.target.value,
    });
  }
  onCancel = (e) => {
    e.preventDefault();
    if (this.props.edit) {
      this.props.onCancleEdit();
    }
    this.onReset();
  }
  handleBlur = (event) => {
    console.log(event);
  }
  onSubmit = (event) => {
    event.preventDefault();
    if (this.props.edit === true) {
      this.props.onUpdate(this.state);
      this.props.onCancleEdit();
      this.onReset();
    } else {
      this.props.onAddEvent(this.state);
      this.onReset();
    }
  }
  render() {
    return (
      <div className="b-block-left">
        <div className="b-group-btn">
          <Button className="b-btn waves-effect waves-light" onClick={this.showModal}>
            TẠO
          </Button>
        </div>
        <Modal
          visible={this.state.visible}
          onOk={this.handleOk}
          // onCancel={this.handleCancel}
          footer={null}
          closable={false}
        >
          <div className="b-book">
            <div className="b-heading">
              <h2 className="b-text-title">
                ĐẶT LỊCH PHÒNG HỌP
              </h2>
            </div>
            <div className="b-content">
              <form className="b-form" onSubmit={this.onSubmit}>
                <div className="b-form-group">
                  <input type="text" placeholder="Nhập Tiêu Đề" name="title" className="b-input" onChange={this.onChanger} value={this.state.title} required />
                  {/* {this.state.formErrors.title ? <span>{this.state.formErrors.title}</span> : <></>} */}
                </div>
                <div className="b-form-group">
                  <label style={{ paddingRight: '10px' }}>Chọn Ngày</label>
                  <DatePicker onChange={this.onChange} allowClear={false} value={moment(this.state.dateStart, dateFormat)} format={dateFormat} required />
                </div>
                <div className="b-form-group">
                  <label style={{ paddingRight: '10px' }}>Giờ Bắt Đầu</label>
                  <TimePicker hideDisabledOptions disabledHours={disabledHours} allowClear={false} minuteStep={30} value={moment(this.state.timestart, format)} format={format} onChange={this.onChangeTime} required />
                </div>
                <div className="b-form-group">
                  <label style={{ paddingRight: '10px' }}>Giờ Kết Thúc</label>
                  <TimePicker hideDisabledOptions disabledHours={disabledHours} allowClear={false} minuteStep={30} value={moment(this.state.timeend, format)} format={format} onChange={this.onChangeTimeItem} required />
                </div>
                <div className="b-form-group">
                  <label htmlFor="c">Chọn Phòng</label>
                  <select className="b-select" value={this.state.rooms} name="rooms" onChange={this.onChanger} onBlur={this.handleBlur}>
                    {this.props.room.map(data => (
                      <option value={data.id} key={data.id}>{data.attributes.name} - {data.attributes.seats} Ghế</option>
                    ))}
                  </select>
                </div>
                <div className="b-form-group">
                  <Checkbox name="checkbox" checked={this.state.checkbox} onChange={this.onChangerCheck} value={this.state.checkbox}>Lặp Lại</Checkbox>
                </div>
                <div className={this.state.checkbox ? "b-repeat" : "b-repeat is-disable"}>

                  <div className="b-form-group">
                    <label >Theo</label>
                    <select className="b-select" name='choice' defaultValue={this.state.choice} onChange={this.onChanger}>
                      <option value="daily">Ngày</option>
                      <option value="weekly">Tuần</option>
                      <option value="monthly">Tháng</option>
                      <option value="yearly">Năm</option>
                    </select>
                  </div>
                  {this.state.choice === 'weekly' ?
                    <div className="b-form-group">
                      <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Please select"
                        defaultValue={this.state.byweekday}
                        onChange={this.handleChange}>
                        {children.map(data => (
                          <Option key={data.id} value={data.name}>{data.name}</Option>
                        ))}
                      </Select>
                    </div>
                    :
                    <></>
                  }

                  <div className="b-form-group">
                    <label >Lặp Lại</label>
                    <select className="b-select" name='count' defaultValue={this.state.count} onChange={this.onChanger}>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                      <option value={6}>6</option>
                      <option value={7}>7</option>
                      <option value={8}>8</option>
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                    </select>
                  </div>
                </div>
                <div className="b-form-button">
                  <button type="cancel" className="b-btn b-btn-cancel  waves-effect waves-teal" onClick={this.onCancel}>Hủy</button>
                  <button type="submit" className="b-btn b-btn-save waves-effect waves-teal">Lưu</button>
                </div>
              </form>
            </div>
          </div>
        </Modal>
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
      </div >
    );
  }
}
function mapStateProps(state) {
  return {
    exists_event: state.event.distinct
  }
}
export default connect(mapStateProps, null)(SlideBar);