import React, { Component } from 'react';
import { Modal, Button, DatePicker, TimePicker, Checkbox, Select, Radio, message, Spin } from 'antd';
import { CalenderComponent } from '../../shared/home';
import { connect } from 'react-redux';
import moment from 'moment';
import 'antd/dist/antd.css';
import Cookies from 'universal-cookie';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { Redirect } from 'react-router-dom';
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
var momentFormat = require('moment');
const env = process.env || {}
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
      timestart: dateFormatDate(now, 'HH:MM'),
      timeend: dateFormatDate(now, 'HH:MM'),
      checkbox: false,
      byweekday: ['su', 'mo'],
      count: 1,
      choice: 'daily',
      value: 0,
      validateDate: false,
      validateTime: false,
      validateTimeItem: false,
      validateTimeCompare: false,
      checkboxItem: false,
      data: [],
      valueItem: [],
      fetching: false,
      isRedirect: false
    }
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 800);
  }
  fetchUser = value => {
    var self = this;
    this.setState({ data: [], fetching: true });
    axios.request({
      method: 'GET',
      url: `${env.REACT_APP_API_BE}/api/v1/admin/users`,
      headers: {
        "Accept": "application/json",
        'Content-Type': 'application/json',
        'Authorization': `${'bearer ' + cookies.get('token')}`
      }
    }).then(function (response) {
      const data = response.data.data.map(data => ({
        text: `${data.attributes.email}`,
        value: `${data.attributes.email}`,
      }));
      self.setState({ data, fetching: false });
    }).catch(function (error) {
      console.log(error)
    })
  };

  handleChangeUser = value => {
    this.setState({
      valueItem: value,
      data: [],
      fetching: false,
    });
  };
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
    this.setState({
      [event.target.name]: event.target.value
    })
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
    if ((momentFormat(`${nowCurrent + ' ' + dateString + ':00'}`)).diff(dateFormatDate(now, 'yyyy-mm-dd HH:MM:ss'), 'minutes') < 0) {
      this.setState({
        validateTime: true
      })
    } else {
      this.setState({
        timestart: dateString,
        timeend: dateString,
        validateTime: false
      })
    }
  }

  onChangeTimeItem = (date, dateString) => {
    let nowCurrent = dateFormatDate(this.state.dateStart, 'yyyy-mm-dd');
    if ((momentFormat(`${nowCurrent + ' ' + dateString + ':00'}`)).diff(dateFormatDate(now, 'yyyy-mm-dd HH:MM:ss'), 'minutes') < 0) {
      this.setState({
        validateTimeItem: true
      })
    } else {
      if ((momentFormat(`${nowCurrent + ' ' + dateString + ':00'}`)).diff(`${nowCurrent + ' ' + this.state.timestart + ':00'}`, 'minutes') < 0) {
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
      timestart: dateFormatDate(now, 'hh:MM:ss'),
      timeend: dateFormatDate(now, 'hh:MM:ss'),
      checkbox: false,
      byweekday: ['su', 'mo'],
      count: 1,
      choice: 'daily',
      value: 0,
      validateDate: false,
      validateTime: false,
      validateTimeItem: false,
      validateTimeCompare: false
    })
  }
  onChange = (date, dateString) => {
    if ((momentFormat(dateFormatDate(dateString, 'yyyy-mm-dd HH:mm:ss')).diff(dateFormatDate(now, 'yyyy-mm-dd HH:mm:ss'), 'days')) < 0) {
      this.setState({
        validateDate: true
      })
    } else {
      this.setState({
        dateStart: dateString,
        validateDate: false,
        validateTime: false,
        validateTimeItem: false
      })
    }

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
    } else {
      this.onReset();
    }
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
      var self = this;
      var props = this.props;
      let data = this.state;
      let params = {
        'daystart': data.dateStart,
        'timestart': data.timestart,
        'timeend': data.timeend
      }
      axios.request({
        method: 'GET',
        url: `${env.REACT_APP_API_BE}/api/v1/admin/getbrbyday`,
        headers: {
          "Accept": "application/json",
          'Content-Type': 'application/json',
          'Authorization': `${'bearer ' + cookies.get('token')}`
        },
        params
      }).then(function (response) {
        if (response.data.data.length > 0) {
          message.error('Đã Trùng Lịch');
        } else {
          if (data.timestart === data.timeend) {
            message.error('Thời Gian Phải Khác Nhau');
          } else {
            props.onAddEvent(data);
            self.onReset();
          }

        }
      }).catch(function (error) {
        message.error('Error');
      })

    }
  }
  onChangerCheckUser = (e) => {
    this.setState({
      checkboxItem: e.target.checked
    })
  }
  onSendMain = () => {
    let arrayEmail = '';
    this.state.value.forEach((i, index, item) => {
      if (index === item.length - 1) {
        arrayEmail += `${item[index].key}`;
      } else {
        arrayEmail += `${item[index].key},`;
      }
    })
    return arrayEmail;
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
    const { fetching, data, valueItem } = this.state;
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
        <Modal
          visible={this.state.visible}
          onOk={this.handleOk}
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
                </div>
                <div className="b-form-group">
                  <label style={{ paddingRight: '10px' }}>Chọn Ngày</label>
                  <DatePicker onChange={this.onChange} allowClear={false} value={moment(this.state.dateStart, dateFormat)} format={dateFormat} required />
                  <span className={this.state.validateDate ? "is-error is-check" : "is-error"}>
                    * Thời Gian  Phải Lớn Hơn Thời Gian Hiện Tại
                  </span>
                </div>
                <div className="b-form-group">
                  <label style={{ paddingRight: '10px' }}>Giờ Bắt Đầu</label>
                  <TimePicker hideDisabledOptions disabledHours={disabledHours} allowClear={false} minuteStep={30} value={moment(this.state.timestart, format)} format={format} onChange={this.onChangeTime} required />
                  <span className={this.state.validateTime ? "is-error is-check" : "is-error"}>
                    * Thời Gian  Phải  Lớn Hơn Thời Gian Hiện Tại
                  </span>
                </div>
                <div className="b-form-group">
                  <label style={{ paddingRight: '10px' }}>Giờ Kết Thúc</label>
                  <TimePicker hideDisabledOptions disabledHours={disabledHours} allowClear={false} minuteStep={30} value={moment(this.state.timeend, format)} format={format} onChange={this.onChangeTimeItem} required />
                  <span className={this.state.validateTimeItem ? "is-error is-check" : "is-error"}>
                    * Thời Gian  Phải  Lớn Hơn Thời Gian Hiện Tại
                  </span>
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
                      <option value={365}>365</option>
                    </select>
                  </div>
                </div>
                <Checkbox name="checkboxItem" checked={this.state.checkboxItem} onChange={this.onChangerCheckUser} value={this.state.checkboxItem}>Gửi Mail</Checkbox>
                <div className={this.state.checkboxItem ? "b-sendmail" : "b-sendmail is-disable"} style={{
                  marginTop: '30px'
                }}>
                  <Select
                    mode="multiple"
                    labelInValue
                    value={valueItem}
                    placeholder="Select users"
                    notFoundContent={fetching ? <Spin size="small" /> : null}
                    filterOption={false}
                    onSearch={this.fetchUser}
                    onChange={this.handleChangeUser}
                    style={{ width: '100%' }}
                  >
                    {data.map(d => (
                      <Option key={d.value}>{d.text}</Option>
                    ))}
                  </Select>
                  <button className="b-btn waves-effect waves-ripple" onClick={this.onSendMain}>Gửi Mail</button>
                </div>
                <div className="b-form-button">
                  <button type="cancel" className="b-btn b-btn-cancel  waves-effect waves-teal" onClick={this.onCancel}>Hủy</button>
                  <button type="submit" disabled={this.state.validateDate || this.state.validateTime || this.state.validateTimeItem ? true : false} className="b-btn b-btn-save waves-effect waves-teal">Lưu</button>
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
    exists_event: state.event.distinct,
    data: state.event.all
  }
}

export default connect(mapStateProps, null)(SlideBar);