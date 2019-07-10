import React, { Component } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick
import rrsetPlugin from '../../../../libraries/rruleset';
import listPlugin from '@fullcalendar/list';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import allLocales from '@fullcalendar/core/locales-all';
import { Modal, Radio } from 'antd';
import Cookies from 'universal-cookie';
import { message } from 'antd';
const cookies = new Cookies();
var dateFormat = require('dateformat');
class CalenderComponent extends Component {
  calendarComponentRef = React.createRef()
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      isShowDelete: false,
      valueDelete: 1,
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.onDate !== this.props.onDate) {
      let calendarApi = this.calendarComponentRef.current.getApi()
      calendarApi.gotoDate(this.props.onDate) // call a method on the Calendar object
    }
    if (prevProps.isFilter !== this.props.isFilter) {
      let calendarApi = this.calendarComponentRef.current.getApi()
      calendarApi.gotoDate(this.props.onDate) // call a method on the Calendar object
    }
  }
  gotoPast = () => {
    let calendarApi = this.calendarComponentRef.current.getApi()
    calendarApi.gotoDate('2000-01-01') // call a method on the Calendar object
  }
  onEvent = (info) => {
    this.setState({
      show: true,
      title: info.event.title,
      datestart: dateFormat(info.event.start, "dddd ,  dd mmmm yyyy"),
      day: dateFormat(info.event.start, "yyyy-mm-dd"),
      timestart: info.event.extendedProps.timestart,
      timeend: info.event.extendedProps.timeend,
      room: info.event.extendedProps.room,
      user: info.event.extendedProps.user,
      id: info.event.id,
      redate: info.event.extendedProps.redate,
      recount: info.event.extendedProps.recount,
      reweek: info.event.extendedProps.reweek,
      user_id: info.event.extendedProps.user_id,
      content: info.event.extendedProps.content,
      is_repeat: info.event.extendedProps.is_repeat
    })
  }
  handleClose = () => {
    this.setState({ show: false });
  }
  handleOk = (e) => {
    this.setState({
      show: false,
    });
  }
  handleCancel = (e) => {
    this.setState({
      show: false,
    });
  }
  onDelete(id, user_id) {
    this.setState({
      isShowDelete: true,
      id: id,
      user_id: user_id
    })
  }
  onEdit(id) {
    var self = this.props;
    if (cookies.get('data') === undefined) {
      message.warning('Vui Lòng Đăng Nhập Để Sửa Sự Kiện !')
    } else {
      self.onEdit(id);
    }
    this.setState({
      show: !this.state.show
    })
  }
  onResize = (info) => {
    let data = {
      id: info.event.id,
      timeEnd: dateFormat(info.event.end, 'HH:MM'),
      is_resize: true
    }
    this.props.onUpdate(data);
  }
  oneventDrop = (eventDropInfo) => {
    let data = {
      id: eventDropInfo.event.id,
      daystart: dateFormat(eventDropInfo.event.start, 'yyyy-mm-dd'),
      timestart: dateFormat(eventDropInfo.event.start, 'HH:MM'),
      timeend: dateFormat(eventDropInfo.event.end, 'HH:MM'),
      is_resize: true,
      is_drop: true
    }
    this.props.onUpdate(data);
  }
  onCloseModal = () => {
    this.setState({
      show: !this.state.show
    })
  }
  onChangeDeleteEvent = (e) => {
    this.setState({
      valueDelete: e.target.value,
    });
  }
  handleDeleteOk = () => {
    const { id } = this.state;
    var self = this.props;
    if (this.state.valueDelete === 2) {
      self.onDeleteException(this.state);
      this.setState({
        isShowDelete: false,
        show: !this.state.show,
        valueDelete: 1
      })
    } else {
      self.onDelete(id);
      this.setState({
        isShowDelete: false,
        show: !this.state.show,
        valueDelete: 1
      })
    }
  }
  onCloseDelete = () => {
    this.setState({
      isShowDelete: false
    })
  }
  onRederText(value) {
    switch (value) {
      case "daily":
        return "Lặp lại theo ngày";
      case "weekly":
        return "Lặp lại theo tuần";
      case "monthly":
        return "Lặp lại theo tháng";
      case "yearly":
        return "Lặp lại theo năm";
      default:
        return null;
    }
  }
  render() {
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    return (
      <React.Fragment>
        <Modal
          header={null}
          visible={this.state.isShowDelete}
          onOk={this.handleDeleteOk}
          onCancel={this.onCloseDelete}
          closable={false}
          okText="Xác Nhận"
          cancelText="Hủy"
        >
          <div className="b-events">
            <Radio.Group onChange={this.onChangeDeleteEvent} value={this.state.valueDelete}>
              {this.state.is_repeat ?
                <React.Fragment>
                  <Radio style={radioStyle} value={1}>
                    Xóa Tất Cả Sự Kiện Này
                  </Radio>
                  <Radio style={radioStyle} value={2}>
                    Chỉ Xóa Sự Kiện Này
                  </Radio>
                </React.Fragment>
                :
                <div className="b-check-delete">
                  <p className="b-text-norm">
                    <span className="fas fa-exclamation-triangle" /> Xóa Đặt Phòng Này
                  </p>
                </div>
              }

            </Radio.Group>
          </div>
        </Modal>
        <Modal
          header={null}
          visible={this.state.show}
          onOk={this.handleOk}
          closable={false}
          footer={null}
        >
          <div className="b-events">
            <div className="b-button-funtion">
              <div className="b-item">
                <button className="b-btn" onClick={this.onEdit.bind(this, this.state.id)}>
                  <span className="fas fa-pencil-alt" />
                </button>
              </div>
              <div className="b-item">
                <button className="b-btn" onClick={this.onDelete.bind(this, this.state.id)}>
                  <span className="far fa-trash-alt" />
                </button>
              </div>
              <div className="b-item">
                <button className="b-btn" onClick={this.onCloseModal}>
                  <span className="fas fa-times" />
                </button>
              </div>
            </div>
            <div className="b-content">
              <div>
                <h2 className="b-text-title">
                  [{this.state.title}]
                </h2>
                <p className="b-text-norm">
                  {this.state.datestart} ( {this.state.timestart} - {this.state.timeend} )
                </p>
                <p className="b-text-rom">
                  {this.state.room}
                </p>
              </div>
              <div>
                <p className="b-text-user">
                  {this.state.user}
                </p>
                <p className={this.state.redate !== 'Không Lặp' ? "b-text-user" : ''}>
                  {this.onRederText(this.state.redate)}
                </p>
                <p>
                  {this.state.recount ? `${this.state.recount + '  lần lặp lại'}` : ''}
                </p>
              </div>
            </div>
          </div>
        </Modal>
        <FullCalendar
          schedulerLicenseKey={'GPL-My-Project-Is-Open-Source'}
          defaultView="timeGridWeek"
          customButtons={{
            custom: {
              text: 'Chọn Ngày',
              click: this.onShowCalender
            }
          }}
          header={{
            right: 'custom prev,next today',
            center: 'title ',
            left: 'dayGridMonth,timeGridWeek,resourceTimeGridDay',
          }}
          listDayFormat
          height={'parent'}
          timeZone={'local'}
          contentHeight={600}
          aspectRatio={1}
          handleWindowResize
          allDayText={'Giờ'}
          allDaySlot
          plugins={
            [
              resourceTimeGridPlugin,
              rrsetPlugin,
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin
            ]
          }
          ref={this.calendarComponentRef}
          weekends={this.state.calendarWeekends}
          events={this.props.data}
          resources={
            this.props.room
          }
          defaultDate={dateFormat(this.state.datenow, 'yyyy-mm-dd')}
          navLinks
          editable={false}
          eventLimit
          viewObject={{
            currentStart: '2019-05-07'
          }}
          minTime={'07:30:00'}
          maxTime={'19:30:00'}
          eventClick={this.onEvent.bind(this)}
          locales={allLocales}
          locale={'vi'}
          droppable={false}
          eventTextColor={'#FEFEF9'}
          eventBorderColor={'rgba(0,0,0,1.5)'}
        />
      </React.Fragment>
    );
  }
}

export default CalenderComponent;
