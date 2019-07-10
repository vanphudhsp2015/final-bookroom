import React, { Component } from 'react';
import { HeaderLayout } from '../../layouts/home';
import {
  DatePicker,
  Select,
  Modal,
  message,
  Radio,
  InputNumber
} from 'antd';
import { SearchComponent } from '../../shared/home';
import moment from 'moment';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as action from '../../../actions/events';
import * as actionRoom from '../../../actions/room';
import { connect } from 'react-redux';
import queryString from 'query-string'
import Cookies from 'universal-cookie';
import { http } from '../../../libraries/http/http';
const htmlToText = require('html-to-text');
const dateFormat = 'YYYY-MM-DD';
const { Option } = Select;
var dateFormatDate = require('dateformat');
var now = new Date()
const cookies = new Cookies();
const children = [
  { id: '1', name: 'su', title: 'Chủ Nhật' },
  { id: '2', name: 'mo', title: 'Thứ Hai' },
  { id: '3', name: 'tu', title: 'Thứ Ba' },
  { id: '4', name: 'we', title: 'Thứ Tư' },
  { id: '5', name: 'th', title: 'Thứ Năm' },
  { id: '6', name: 'fr', title: 'Thứ Sáu' },
  { id: '7', name: 'sa', title: 'Thứ Bảy' }
];
const arrayTime = [
  { id: '1', date: '07:00' },
  { id: '2', date: '07:30' },
  { id: '3', date: '08:00' },
  { id: '4', date: '08:30' },
  { id: '5', date: '09:00' },
  { id: '6', date: '09:30' },
  { id: '7', date: '10:00' },
  { id: '8', date: '10:30' },
  { id: '9', date: '11:00' },
  { id: '10', date: '11:30' },
  { id: '11', date: '12:00' },
  { id: '12', date: '12:30' },
  { id: '14', date: '13:00' },
  { id: '15', date: '13:30' },
  { id: '16', date: '14:00' },
  { id: '17', date: '14:30' },
  { id: '18', date: '15:00' },
  { id: '19', date: '15:30' },
  { id: '20', date: '16:00' },
  { id: '21', date: '16:30' },
  { id: '22', date: '17:00' },
  { id: '23', date: '17:30' },
  { id: '24', date: '18:00' },
  { id: '25', date: '18:30' }
];
const keyESC = 27;
class CalenderInfoPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      data: [],
      value: [],
      fetching: false,
      dateStart: this.props.match.params.calender !== undefined ?
        this.props.match.params.date :
        ((this.props.match.path === '/new' && (queryString.parse(this.props.location.search).date === undefined) ?
          moment(now, 'YYYY-MM-DD') :
          (queryString.parse(this.props.location.search).date !== undefined ?
            moment(queryString.parse(this.props.location.search).date, 'YYYY-MM-DD') :
            moment(now, 'YYYY-MM-DD')))),
      timestart: this.roundMinutesDate(now, 0),
      timeend: this.roundMinutesDate(now, 60),
      selectRepeat: [
        { id: '2', name: 'Không lặp lại' },
        { id: '3', name: 'Mọi ngày trong tuần từ thứ 2 đến thứ 6' },
        { id: '1', name: 'Hàng ngày', count: 10 },
        { id: '0', name: 'Tùy chỉnh' },
      ],
      visible: false,
      repeat: '2',
      byweekday: [],
      choice: 'daily',
      count: 1,
      rooms: this.props.room.length > 0 ? this.props.room[0].id : 1,
      content: "",
      checkbox: false,
      validateDate: false,
      validateTime: false,
      validateTimeItem: false,
      isShowEdit: false,
      valueEdit: 1,
      isRepeat: false,
      arrayEmail: [],
      minCount: 1,
      maxCount: 365,
      edit: false
    };
  }
  roundMinutesDate(data, add) {
    const start = moment(data);
    const remainder = 30 - (start.minute() % 30) + add;
    const dateTime = moment(start).add(remainder, "minutes").format("HH:mm");
    return dateTime;
  }
  componentDidMount() {
    this.props.dispatch(action.requestGetEvent());
    this.props.dispatch(actionRoom.requestGetRoom());
    var values = queryString.parse(this.props.location.search)
    if (values.date !== undefined) {
      this.setState({
        dateStart: values.date,
        timestart: values.time,
        timeend: this.roundMinutesDate(`${values.date} ${values.time}`, 30)
      })
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.match.params.calender !== undefined) {
      if (this.props.data !== prevProps.data) {
        let data = this.props.data.filter(item => parseInt(item.id) === parseInt(this.props.match.params.calender))
        if (data[0].attributes.repeat !== null) {
          this.onAddSelectDate(data[0].attributes.repeat.repeatby, data[0].attributes.repeat.count)
        }
        var values = queryString.parse(this.props.location.search)
        this.setState({
          edit: true,
          arrayEmail: data[0].attributes.mailto,
          isRepeat: data[0].attributes.repeat !== null ? true : false,
          id: data[0].id,
          title: data[0].attributes.title,
          content: data[0].attributes.content !== null ? data[0].attributes.content : "",
          dateStart: this.props.match.params.date,
          timestart: dateFormatDate(`${this.state.dateStart} ${values.timestart}`, 'HH:MM'),
          timeend: dateFormatDate(`${this.state.dateStart} ${values.timeend}`, 'HH:MM'),
          count: data[0].attributes.repeat !== null ? data[0].attributes.repeat.count : 1,
          rooms: values.room,
          checkbox: data[0].attributes.repeat !== null ? true : false,
          choice: data[0].attributes.repeat !== null ? data[0].attributes.repeat.repeatby : 'daily',
          selectRepeat: data[0].attributes.repeat !== null ? [...this.state.selectRepeat, { id: '99', name: `Lặp Lại Theo ${this.onChangerCalender(data[0].attributes.repeat.repeatby)} ${data[0].attributes.repeat.count - 1} Lần` }] : this.state.selectRepeat,
          repeat: data[0].attributes.repeat !== null ? '99' : '2'
        })
      }
    }
  }
  handleChangeByWeek = (value) => {
    this.setState({
      byweekday: value
    })
  }
  onChanger = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
    if (this.state.title.length > 190) {
      message.error('Vui lòng nhập tiêu đề ngắn hơn 150 ký tự!');
      return;
    }
  }
  onChangeDate = (date, dateString) => {
    if (dateString === '') {
      message.error('Vui lòng nhập đúng chuẩn thời gian ');
      this.setState({
        validateDate: true
      })
      return;
    }
    if (moment(moment(dateString, 'YYYY-MM-DD')).diff(moment(now, 'YYYY-MM-DD'), 'days') < 0) {
      this.setState({
        validateDate: true
      })
    } else {
      this.setState({
        dateStart: moment(dateString, 'YYYY-MM-DD'),
        timestart: this.roundMinutesDate(now, 0),
        timeend: this.roundMinutesDate(now, 60),
        validateDate: false
      })
    }
  }
  onChangeTime = (event) => {
    if (moment(`${dateFormatDate(this.state.dateStart, 'yyyy-mm-dd')} ${event}`).diff(now, 'minutes') <= 0) {
      message.error('Vui lòng nhập thời gian lớn hơn hiện tại');
      return;
    } else {
      this.setState({
        timestart: event,
        timeend: this.roundMinutesDate(`${dateFormatDate(this.state.dateStart, 'yyyy-mm-dd')} ${event}`, 30),
      })
    }
  }
  onChangeTimeItem = (event) => {
    if (moment(`${dateFormatDate(this.state.dateStart, 'yyyy-mm-dd')} ${event}`).diff(now, 'minutes') <= 0) {
      message.error('Vui lòng nhập thời gian lớn hơn hiện tại');
      return;
    } else {
      if (moment(`${dateFormatDate(this.state.dateStart, 'yyyy-mm-dd')} ${event}`).diff(`${dateFormatDate(this.state.dateStart, 'yyyy-mm-dd')} ${this.state.timestart}`, 'minutes') <= 0) {
        message.error('Vui lòng nhập thời gian kết thúc lớn hơn thời gian bắt đầu')
      } else {
        this.setState({
          timeend: event
        })
      }
    }
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  handleOk = e => {
    this.setState({
      visible: false,
      repeat: '1'
    });
  };
  handleCancel = e => {
    if (e.keyCode === keyESC) {
      this.setState({
        visible: false,
        repeat: '1'
      });
    }
  };
  onChangerSelectRepeat = (event) => {
    switch (event.target.value) {
      case '0':
        this.setState({
          visible: true,
        })
        break;
      case '1':
        this.setState({
          [event.target.name]: event.target.value,
          count: 90,
          checkbox: true
        })
        break;
      case '2':
        this.setState({
          checkbox: false,
          [event.target.name]: event.target.value
        })
        break;
      case '3':
        this.setState({
          [event.target.name]: event.target.value,
          count: 90,
          byweekday: ['mo', 'tu', 'we', 'th', 'fr'],
          checkbox: true,
          choice: 'weekly'
        })
        break;
      case '99':
        this.setState({
          [event.target.name]: event.target.value,
          checkbox: true,
          choice: this.state.choice
        })
        break;
      default:
        this.setState({
          [event.target.name]: event.target.value,
        })
    }

  }
  onCancel = (event) => {
    event.preventDefault();
    this.setState({
      visible: false,
      selectRepeat: [
        { id: '2', name: 'Không lặp lại' },
        { id: '3', name: 'Mọi ngày trong tuần từ thứ 2 đến thứ 6' },
        { id: '1', name: 'Hàng ngày', count: 10 },
        { id: '0', name: 'Tùy chỉnh' },
      ],
      count: 1
    })
  }
  onSubmitDate = (event) => {
    event.preventDefault();
    let covertName = '';
    switch (this.state.choice) {
      case "daily":
        covertName = "Lặp lại hàng ngày"
        this.setState({
          choice: 'daily'
        })
        this.setState({
          count: this.state.count
        })
        break;
      case "monthly":
        covertName = "Lặp lại hàng tháng"
        this.setState({
          choice: 'monthly'
        })
        this.setState({
          count: this.state.count
        })
        break;
      case "yearly":
        covertName = "Lặp lại hàng năm"
        this.setState({
          choice: 'yearly'
        })
        this.setState({
          count: this.state.count
        })
        break;
      case "weekly":
        let nameWeek = '';
        this.state.byweekday.forEach((i, index, item) => {
          if (index === item.length - 1) {
            nameWeek += `${this.onTranslate(item[index])}`;
          } else {
            nameWeek += `${this.onTranslate(item[index])},`;
          }
        })
        covertName = `Các thứ  [ ${nameWeek} ] trong tuần`
        this.setState({
          choice: 'weekly',
          count: this.state.count
        })
        break;
      default:
        covertName = 'daily'
        this.setState({
          choice: 'yearly'
        })
        break;
    }
    let data = [...this.state.selectRepeat.filter(data => data.id !== "99"), { id: '99', name: `${covertName + ` ${this.state.count} Lần `}`, count: this.state.count }]
    this.setState({
      selectRepeat: data,
      repeat: '99',
      visible: false,
      checkbox: true,
    })
  }
  onAddSelectDate(choice, count) {
    let covertName = '';
    switch (choice) {
      case "daily":
        covertName = "Lặp lại hàng ngày"
        break;
      case "monthly":
        covertName = "Lặp lại hàng tháng"
        break;
      case "yearly":
        covertName = "Lặp Lại hàng năm"
        break;
      case "weekly":
        let nameWeek = '';
        this.state.byweekday.forEach((i, index, item) => {
          if (index === item.length - 1) {
            nameWeek += `${this.onTranslate(item[index])}`;
          } else {
            nameWeek += `${this.onTranslate(item[index])},`;
          }
        })
        covertName = `Các ngày ${nameWeek} trong tuần`
        break;
      default:
        covertName = 'daily'
        break;
    }
    let data = [...this.state.selectRepeat, { id: '99', name: `${covertName + ` ${count} Lần `}`, count: count }]
    this.setState({
      selectRepeat: data,
      repeat: '99',
      visible: false,
      checkbox: true
    })
  }
  onSubmit = (event) => {
    event.preventDefault();
    var self = this.state;
    var selfProps = this.props;
    var selfThis = this;
    let data = this.state;
    if (cookies.get('data') === undefined) {
      message.error('Vui lòng đăng nhập để tạo phòng !');
      return;
    }
    if (this.state.validateDate === true) {
      message.error('Vui lòng nhập thời gian  !');
      return;
    }
    if (self.title.length > 190) {
      message.error('Vui lòng nhập tiêu đề ngắn hơn 150 ký tự!');
      return;
    }
    if (self.title.trim() === '') {
      message.error('Vui lòng nhập tên tiêu đề cuộc họp !');
    } else {
      if (selfProps.match.params.calender !== undefined) {
        selfThis.setState({
          isShowEdit: true
        })
      } else {
        let email = '';
        if (data.arrayEmail !== undefined && data.arrayEmail.length > 0) {
          if (data.arrayEmail.length > 1) {
            data.arrayEmail.forEach((i, index, item) => {
              if (index === item.length - 1) {
                email += `${item[index].key}`;
              } else {
                email += `${item[index].key},`;
              }
            })
          } else {
            data.arrayEmail.forEach((i, index, item) => {
              email += `${item[index].key}`
            })
          }

        }
        let formDataObject = {};
        if (data.checkbox === true) {
          let arrayDay = '';
          if (data.byweekday !== null) {
            if (data.byweekday.length > 1) {
              data.byweekday.forEach((i, index, item) => {
                if (index === item.length - 1) {
                  arrayDay += `${item[index]}`;
                } else {
                  arrayDay += `${item[index]},`;
                }
              })
            } else {
              data.byweekday.forEach((i, index, item) => {
                arrayDay += `${item[index]}`;
              })
            }
          }
          formDataObject = {
            'room_id': data.rooms,
            'title': data.title,
            'content': htmlToText.fromString(data.content),
            'user_id': cookies.get('data').id,
            'daystart': dateFormatDate(data.dateStart, 'yyyy-mm-dd'),
            'timestart': data.timestart,
            'timeend': data.timeend,
            'repeatby': data.choice,
            'interval': 1,
            'count': data.byweekday.length > 0 ? (data.count * data.byweekday.length + 1) : (data.count + 1),
            'byweekday': data.choice === 'weekly' ? arrayDay : '',
            'mail': data.arrayEmail === undefined ? '' : email
          }
        } else {
          formDataObject = {
            'room_id': data.rooms,
            'content': htmlToText.fromString(data.content),
            'user_id': cookies.get('data').id,
            'daystart': dateFormatDate(data.dateStart, 'yyyy-mm-dd'),
            'timestart': data.timestart,
            'timeend': data.timeend,
            'title': data.title,
            'mail': data.arrayEmail === undefined ? '' : email
          }
        }
        http.request({
          url: `/bookrooms`,
          method: 'POST',
          data: formDataObject
        }).then(function (response) {
          message.success('Đặt phòng thành công !')
          selfProps.dispatch(action.requestAddEventCheck(response));
          selfProps.history.push(`/?date=${dateFormatDate(self.dateStart, 'yyyy-mm-dd')}`);
        }).catch(function (error) {
          message.error(error.messages[0])
        })
      }
    }
  }
  handleEditOk = () => {
    var selfProps = this.props;
    var selfState = this.state;
    if (this.state.valueEdit === 1) {
      let data = this.state;
      let email = '';
      if (data.arrayEmail !== undefined && data.arrayEmail.length > 0) {
        if (data.arrayEmail.length > 1) {
          data.arrayEmail.forEach((i, index, item) => {
            if (index === item.length - 1) {
              email += `${item[index].key}`;
            } else {
              email += `${item[index].key},`;
            }
          })
        } else {
          data.arrayEmail.forEach((i, index, item) => {
            email += `${item[index].key}`
          })
        }
      }
      let formDataObject = {};
      if (data.checkbox === true) {
        let arrayDay = '';
        if (data.byweekday !== null) {
          if (data.byweekday.length > 1) {
            data.byweekday.forEach((i, index, item) => {
              if (index === item.length - 1) {
                arrayDay += `${item[index]}`;
              } else {
                arrayDay += `${item[index]},`;
              }
            })
          } else {
            data.byweekday.forEach((i, index, item) => {
              arrayDay += `${item[index]}`;
            })
          }
        }
        formDataObject = {
          'room_id': data.rooms,
          'content': htmlToText.fromString(data.content),
          'title': data.title,
          'user_id': cookies.get('data').id,
          'daystart': dateFormatDate(data.dateStart, 'yyyy-mm-dd'),
          'timestart': data.timestart,
          'timeend': data.timeend,
          'check': '1',
          'repeatby': data.choice,
          'interval': 1,
          'count': data.byweekday.length > 0 ? (data.count * data.byweekday.length + 1) : (data.count + 1),
          'byweekday': data.choice === 'weekly' ? arrayDay : '',
          'mail': email
        }
      } else {
        formDataObject = {
          'room_id': data.rooms,
          'content': htmlToText.fromString(data.content),
          'user_id': cookies.get('data').id,
          'daystart': dateFormatDate(data.dateStart, 'yyyy-mm-dd'),
          'timestart': data.timestart,
          'timeend': data.timeend,
          'check': '0',
          'title': data.title,
          'mail': email
        }
      }
      http.request({
        url: `/bookrooms/${data.id}`,
        method: 'PUT',
        data: formDataObject
      }).then(function (response) {
        message.success('Sửa đặt phòng thành công !');
        selfProps.dispatch(action.requestUpdateEvent(response));
        selfProps.history.push(`/?date=${dateFormatDate(selfState.dateStart, 'yyyy-mm-dd')}`);
      }).catch(function (error) {
        message.error(error.messages[0])
      })
    } else {
      var values = queryString.parse(this.props.location.search)
      selfProps.dispatch(action.requestEditException(selfState, selfProps.match.params.date, selfState.rooms, values));
      selfProps.history.push(`/?date=${dateFormatDate(selfState.dateStart, 'yyyy-mm-dd')}`);
    }
    this.setState({
      isShowEdit: false
    })
  }
  onCloseEdit = (e) => {
    this.setState({
      isShowEdit: false
    })
  }
  onChangeEditEvent = (e) => {
    this.setState({
      valueEdit: e.target.value,
    });
  }
  _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      console.log('do validate');
    }
  }
  onGetArrayEmail = (data) => {
    this.setState({
      arrayEmail: data
    })
  }
  onChangeNumber = (value) => {
    var regex = /^[0-9.]+$/;
    if (value > 365) {
      message.error('Vui Lòng nhập số lượng lặp lại nhỏ hơn 365');
      return;
    }
    if (value.toString().match(regex) === null) {
      message.error('Vui lòng nhập số !');
      return;
    }
    this.setState({
      count: value
    })
  }
  onChangerChoice = (event) => {
    switch (event.target.value) {
      case 'daily':
        this.setState({
          maxCount: 365
        })
        break;
      case 'monthly':
        this.setState({
          maxCount: 6
        })
        break;
      case 'weekly':
        this.setState({
          maxCount: 52
        })
        break;
      case 'yearly':
        this.setState({
          maxCount: 2
        })
        break;
      default:
        this.setState({
          maxCount: 365
        })
    }
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  onTranslate(item) {
    let data = '';
    switch (item) {
      case "mo":
        data = 'Thứ Hai';
        break;
      case "tu":
        data = 'Thứ Ba';
        break;
      case "th":
        data = 'Thứ Tư';
        break;
      case "we":
        data = 'Thứ Năm';
        break;
      case "fr":
        data = 'Thứ Sáu';
        break;
      case "sa":
        data = 'Thứ Bảy';
        break;
      case "su":
        data = 'Chủ Nhật';
        break;
      default:
        return 'Thứ Hai'
    }
    return data;
  }
  onChangerCalender(item) {
    let data = '';
    switch (item) {
      case "daily":
        data = 'Ngày';
        break;
      case "monthly":
        data = 'Tháng';
        break;
      case "yearly":
        data = 'Năm';
        break;
      case "weekly":
        data = 'Tuần';
        break;
      default:
        return 'Ngày'
    }
    return data;
  }
  onCancelForm = (event) => {
    event.preventDefault();
    this.props.history.push(`/?date=${dateFormatDate(this.state.dateStart, 'yyyy-mm-dd')}`);
  }
  render() {
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    return (
      <div className="wrapper">
        <HeaderLayout searchDate={this.state.searchDate} />
        <main className="b-page-main">
          <div className="b-page-calender">
            <Modal
              header={null}
              visible={this.state.isShowEdit}
              onOk={this.handleEditOk}
              onCancel={this.onCloseEdit}
              closable={false}
              okText="Xác Nhận"
              cancelText="Hủy"
            >
              <div className="b-events">
                <Radio.Group onChange={this.onChangeEditEvent} value={this.state.valueEdit}>
                  {this.state.isRepeat ?
                    <React.Fragment>
                      <Radio style={radioStyle} value={2}>
                        Chỉ sửa đặt phòng này
                      </Radio>
                      <Radio style={radioStyle} value={1}>
                        Sửa tất cả đặt phòng này
                      </Radio>
                    </React.Fragment>
                    :
                    <React.Fragment>
                      <Radio style={radioStyle} value={1}>
                        Sửa  đặt phòng này
                      </Radio>
                    </React.Fragment>
                  }
                </Radio.Group>
              </div>
            </Modal>
            <Modal
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              footer={null}
              closable={false}
            >
              <div className="b-repeat">
                <div className="b-book">
                  <div className="b-heading">
                    <h2 className="b-text-title">
                      ĐẶT LỊCH PHÒNG HỌP
                    </h2>
                  </div>
                  <div className="b-content">
                    <form onSubmit={this.onSubmitDate}>
                      <div className="b-repeat">
                        <div className="b-form-group">
                          <label >Theo</label>
                          <select
                            className="b-select"
                            name='choice'
                            value={this.state.choice}
                            onChange={this.onChangerChoice}
                          >
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
                              placeholder="Chọn thứ trong tuần !"
                              defaultValue={this.state.byweekday}
                              onChange={this.handleChangeByWeek}
                            >
                              {children.map(data => (
                                <Option key={data.id} value={data.name}>{data.title}</Option>
                              ))}
                            </Select>
                          </div>
                          :
                          null
                        }
                        <div className="b-form-group">
                          <label >Lặp Lại</label>
                          <InputNumber
                            min={this.state.minCount}
                            max={this.state.maxCount}
                            value={this.state.count}
                            onChange={this.onChangeNumber}
                          />
                        </div>
                      </div>
                      <div className="b-form-button">
                        <button type="cancel" className="b-btn b-btn-cancel  waves-effect waves-teal" onClick={this.onCancel}>Hủy</button>
                        <button type="submit" className="b-btn b-btn-save waves-effect waves-teal" >Lưu</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </Modal>
            <form onSubmit={this.onSubmit}>
              <div className="b-heading">
                <div className="b-heading-left">
                  <div className="b-form-group">
                    <input
                      type="text"
                      name="title"
                      autoComplete="off"
                      value={this.state.title}
                      placeholder="Nhập tiêu đề"
                      className="b-input"
                      onChange={this.onChanger}
                    />
                    <span className={this.state.title === '' ? "" : "is-current"}>*</span>
                  </div>
                  <div className="b-group-select">
                    <div className="b-form-group">
                      <label>Ngày cuộc họp</label>
                      <br />
                      <DatePicker
                        allowClear={false}
                        className="b-picker"
                        onChange={this.onChangeDate}
                        defaultValue={moment(this.state.dateStart, dateFormat)}
                        format={dateFormat}
                      />
                      <span className={this.state.validateDate ? "is-error  is-check" : "is-error"}>
                        * Thời gian không hợp lệ
                      </span>
                    </div>
                    <div className="b-form-group">
                      <label>Thời gian bắt đầu</label>
                      <br />
                      <Select value={this.state.timestart} onChange={this.onChangeTime}>
                        {arrayTime.map(data => (
                          <Option key={data.id} value={data.date}>{data.date}</Option>
                        ))
                        }
                      </Select>
                      <span className={this.state.validateTime ? "is-error is-check" : "is-error"}>
                        * Thời gian lớn hơn hiện tại
                      </span>
                    </div>
                    <div className="b-form-group">
                      <label>Thời gian kết thúc</label>
                      <br />
                      <Select value={this.state.timeend} onChange={this.onChangeTimeItem}>
                        {arrayTime.map(data => (
                          <Option key={data.id} value={data.date}>{data.date}</Option>
                        ))
                        }
                      </Select>
                      <span className={this.state.validateTimeItem ? "is-error is-check" : "is-error"}>
                        * Thời gian lớn hơn hiện tại
                      </span>
                    </div>
                  </div>
                  <div className="b-select-repeat">
                    <div className="b-form-group">
                      <select
                        className="b-select"
                        value={this.state.repeat}
                        name="repeat"
                        onChange={this.onChangerSelectRepeat}
                      >
                        {
                          this.state.selectRepeat.map(data => (
                            <option key={data.id} value={data.id}>{data.name}</option>
                          ))
                        }
                      </select>
                    </div>
                  </div>
                </div>
                <div className="b-heading-right">
                  <button className="b-btn waves-effect waves-ripple" type="submit">Lưu</button>
                  <button className="b-btn b-btn-cancel waves-effect waves-ripple" type="cancel" onClick={this.onCancelForm}>Hủy</button>
                </div>
              </div>
            </form>
            <div className="b-page-description">
              <div className="b-description-left">
                <div className="b-heading">
                  <h2 className="b-text-title">
                    Chi tiết sự kiện
                  </h2>
                </div>
                <div className="b-description-content">
                  <div className="b-form-group">
                    <div className="b-icon">
                      <i className="fas fa-bell" />
                    </div>
                    <div className="b-form-control">
                      <select
                        className='b-input'
                        name="rooms"
                        value={this.state.rooms}
                        onChange={this.onChanger}
                      >
                        {this.props.room.map(data => (
                          <option key={data.id} value={data.id}>{data.attributes.name} - {data.attributes.seats} Chổ ngồi</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="b-form-group">
                    <div className="b-icon">
                      <i className="fas fa-align-right" />
                    </div>
                    <div className="b-form-control b-editor">
                      <CKEditor
                        style={{
                          height: '300px'
                        }}
                        editor={ClassicEditor}
                        data={this.state.content}
                        onInit={editor => {
                        }}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          this.setState({
                            content: data
                          })
                        }}
                        config={{
                          // plugins: [Essentials, Heading, Paragraph, Bold, Italic, BlockQuote, Alignment, List, Link],
                          toolbar: ['Heading', '|'],
                          removePlugins: ['Image', 'ImageCaption', 'ImageStyle', 'ImageToolbar', 'ImageUpload', 'Italic', 'Link', 'BlockQuote', 'Undo', 'Redo', 'Bold']
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <SearchComponent
                onGetArrayEmail={this.onGetArrayEmail}
                arrayEmail={this.state.arrayEmail}
                edit={this.state.edit}
              />
            </div>
          </div>
        </main>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    data: state.event.all,
    room: state.room.all
  }
}
export default connect(mapStateToProps)(CalenderInfoPage);
