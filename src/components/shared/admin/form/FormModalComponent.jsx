import React, { Component } from 'react';
import { DatePicker, TimePicker, Checkbox, Select } from 'antd';
import moment from 'moment';
import 'antd/dist/antd.css';
import { Modal } from 'antd';
var dateFormatDate = require('dateformat');
const format = 'HH:mm';
const dateFormat = 'YYYY-MM-DD';
var now = new Date()
const Option = Select.Option;
const children = [
  { id: '1', name: 'su' },
  { id: '2', name: 'mo' },
  { id: '3', name: 'tu' },
  { id: '4', name: 'we' },
  { id: '5', name: 'th' },
  { id: '6', name: 'fr' },
  { id: '7', name: 'sa' }
];
function disabledHours() {
  return [0, 1, 2, 3, 4, 5, 6, 7, 12, 18, 19, 20, 21, 22, 23, 24];
}
class FormModalComponent extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      visible: false,
      calender: [],
      title: 'Đặt Phòng Mới',
      rooms: this.props.room.length > 0 ? this.props.room[0].id : '',
      dateStart: dateFormatDate(now, 'yyyy-mm-dd'),
      timestart: this.roundMinutesDate(now, 0),
      timeend: this.roundMinutesDate(now, 60),
      checkbox: false,
      byweekday: ['su', 'mo'],
      count: 1,
      choice: 'daily',
      content: '',
      value: 0,
      validateDate: false,
      validateTime: false,
      validateTimeItem: false,
      validateTimeCompare: false
    }
  }
  roundMinutesDate(data, add) {
    const start = moment(data);
    const remainder = 30 - (start.minute() % 30) + add;
    const dateTime = moment(start).add(remainder, "minutes").format("HH:mm");
    return dateTime;
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.room !== prevProps.room && !this.state.rooms && this.props.room.length) {
      this.setState({
        rooms: this.props.room[0].id
      })
    }
    if (prevProps.visible !== this.props.visible) {
      if (prevProps.edit !== this.props.edit) {
        let data = this.props.dataEdit.attributes;
        this.setState({
          id: this.props.dataEdit.id,
          visible: this.props.edit,
          title: data.title,
          dateStart: dateFormatDate(data.daystart, 'yyyy-mm-dd'),
          timestart: data.timestart,
          timeend: data.timeend,
          rooms: data.room.id,
          content: data.content,
          checkbox: data.repeat === null ? false : true,
          choice: data.repeat === null ? 'daily' : data.repeat.repeatby,
          count: data.repeat === null ? 1 : data.repeat.count,
          byweekday: data.repeat === null ? ['su', 'mo'] : data.repeat.byweekday
        })
      } else {
        this.onReset();
        this.setState({
          visible: this.props.visible
        })
      }
    }
  }
  onChanger = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  handleChange = (value) => {
    this.setState({
      byweekday: value
    })
  }
  onChange = (date, dateString) => {
    if ((moment(dateFormatDate(dateString, 'yyyy-mm-dd HH:mm:ss')).diff(dateFormatDate(now, 'yyyy-mm-dd HH:mm:ss'), 'days')) < 0) {
      this.setState({
        validateDate: true
      })
    } else {
      this.setState({
        dateStart: dateString,
        validateDate: false,
        validateTime: false,
        validateTimeItem: false,
      })
    }
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
  onChangeTime = (time, dateString) => {
    let nowCurrent = dateFormatDate(this.state.dateStart, 'yyyy-mm-dd');
    if ((moment(`${nowCurrent + ' ' + dateString + ':00'}`)).diff(dateFormatDate(now, 'yyyy-mm-dd HH:MM:ss'), 'minutes') < 0) {
      this.setState({
        validateTime: true
      })
    } else {
      this.setState({
        timestart: dateString,
        timeend: this.roundMinutesDate(`${nowCurrent + ' ' + dateString + ':00'}`, 30),
        validateTime: false
      })
    }
  }
  onChangeTimeItem = (date, dateString) => {
    let nowCurrent = dateFormatDate(this.state.dateStart, 'yyyy-mm-dd');
    if ((moment(`${nowCurrent + ' ' + dateString + ':00'}`)).diff(dateFormatDate(now, 'yyyy-mm-dd HH:MM:ss'), 'minutes') < 0) {
      this.setState({
        validateTimeItem: true
      })
    } else {
      if ((moment(`${nowCurrent + ' ' + dateString + ':00'}`)).diff(`${nowCurrent + ' ' + this.state.timestart + ':00'}`, 'minutes') < 0) {
        this.setState({
          timeend: dateString,
          timestart: dateString,
          validateTimeItem: false
        })
      } else {
        this.setState({
          timeend: dateString,
          validateTimeItem: false
        })
      }
    }
  }
  onChangerCheck = (e) => {
    this.setState({
      checkbox: e.target.checked
    })

  }
  onSubmit = (event) => {
    event.preventDefault();
    if (this.props.edit === true) {
      this.props.onUpdate(this.state);
      this.onReset();
      this.props.onCheckModal();
    } else {
      this.props.onAddEvent(this.state);
      this.onReset();
      this.props.onCheckModal();
    }
  }
  onSubmitSearch = (event) => {
    event.preventDefault();
    this.setState({
      visible: false
    })
    this.props.onSearchEvent(this.state);
    this.props.onCheckModal();
  }
  onReset() {
    this.setState({
      visible: false,
      calender: [],
      title: 'Đặt Phòng Mới',
      rooms: this.props.room.length > 0 ? this.props.room[0].id : '',
      dateStart: dateFormatDate(now, 'yyyy-mm-dd'),
      timestart: this.roundMinutesDate(now, 0),
      timeend: this.roundMinutesDate(now, 60),
      checkbox: false,
      byweekday: ['su', 'mo'],
      count: 1,
      choice: 'daily',
      value: 0,
      validateDate: false,
      validateTime: false,
      validateTimeItem: false,
      validateTimeCompare: false,
      content: '',
    })
  }
  showModal = () => {
    this.setState({
      visible: true
    })
  }
  handleOk = (e) => {
    this.props.onCheckModal();
    this.setState({
      visible: false,
    });

  }
  handleCancel = (e) => {
    this.props.onCheckModal();
    this.setState({
      visible: false,
    });
  }
  onCancel = (e) => {
    e.preventDefault();
    this.setState({
      visible: false
    })
    this.props.onCheckModal();


  }
  render() {
    const contentMain = () => {
      switch (this.props.views) {
        default:
          return (
            <Modal
              visible={this.state.visible}
              onOk={this.handleOk}
              closable={false}
              footer={null}>
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
                    </div>
                    <div className="b-form-group">
                      <label style={{ paddingRight: '10px' }}>Chọn Ngày</label>
                      <DatePicker hideDisabledOptions allowClear={false} onChange={this.onChange} defaultValue={moment(now, dateFormat)} value={moment(this.state.dateStart, dateFormat)} />
                      <span className={this.state.validateDate ? "is-error is-check" : "is-error"}>
                        * Thời Gian  Phải Lớn Hơn Thời Gian Hiện Tại
                                            </span>
                    </div>
                    <div className="b-form-group">
                      <label style={{ paddingRight: '10px' }}>Giờ Bắt Đầu</label>
                      <TimePicker hideDisabledOptions disabledHours={disabledHours} onChange={this.onChangeTime} value={moment(this.state.timestart, format)} allowClear={false} minuteStep={30} defaultValue={moment(this.state.timestart, format)} format={format} />
                      <span className={this.state.validateTime ? "is-error is-check" : "is-error"}>
                        * Thời Gian  Phải  Lớn Hơn Thời Gian Hiện Tại
                                            </span>
                    </div>
                    <div className="b-form-group">
                      <label style={{ paddingRight: '10px' }}>Giờ Bắt Kết Thúc</label>
                      <TimePicker hideDisabledOptions allowClear={false} disabledHours={disabledHours} minuteStep={30} defaultValue={moment(this.state.timeend, format)} value={moment(this.state.timeend, format)} format={format} onChange={this.onChangeTimeItem} />
                      <span className={this.state.validateTimeItem ? "is-error is-check" : "is-error"}>
                        * Thời Gian  Phải  Lớn Hơn Thời Gian Hiện Tại
                                            </span>
                    </div>
                    <div className="b-form-group">
                      <label htmlFor="c">Chọn Phòng</label>
                      <select className="b-select" value={this.state.rooms} name="rooms" onChange={this.onChanger}>
                        {this.props.room.map(data => (
                          <option value={data.id} key={data.id}>{data.title} - {data.seats} Chổ Ngồi</option>
                        ))}
                      </select>
                    </div>
                    <div className="b-form-group">
                      <Checkbox name="checkbox" checked={this.state.checkbox} onChange={this.onChangerCheck} value={this.state.checkbox}>Lặp Lại</Checkbox>
                    </div>
                    <div className={this.state.checkbox ? "b-repeat" : "b-repeat is-disable"}>

                      <div className="b-form-group">
                        <label >Theo</label>
                        <select className="b-select" name='choice' value={this.state.choice} onChange={this.onChanger}>
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
                        <select className="b-select" name='count' value={this.state.count} onChange={this.onChanger}>
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
                      <button type="cancel" disabled={this.state.formErrors ? true : false} className="b-btn b-btn-cancel  waves-effect waves-teal" onClick={this.onCancel}>Hủy</button>
                      <button type="submit" disabled={this.state.validateDate || this.state.validateTime || this.state.validateTimeItem ? true : false} className="b-btn b-btn-save waves-effect waves-teal">Lưu</button>
                    </div>
                  </form>
                </div>
              </div>
            </Modal>
          )
      }
    }
    return (
      contentMain()
    );
  }
}

export default FormModalComponent;
