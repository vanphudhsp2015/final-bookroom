import React, { Component } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list';
import rrulePlugin from '@fullcalendar/rrule';
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import allLocales from '@fullcalendar/core/locales-all';
import '../../../../main.scss'
import { Modal, Calendar } from 'antd';
import Cookies from 'universal-cookie';
import { message } from 'antd';
const cookies = new Cookies();
const confirm = Modal.confirm;
var dateFormat = require('dateformat');
var now = new Date()
dateFormat.i18n = {
    dayNames: [
        'CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7',
        'Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'
    ],
    monthNames: [
        'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12',
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ],
    timeNames: [
        'a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM'
    ]
};
class FullcalenderComponent extends Component {
    calendarComponentRef = React.createRef()
    constructor(props) {
        super(props);
        this.state = {
            calendarWeekends: true,
            ArrayList: [],
            show: false,
            title: '',
            description: '',
            datenow: now,
            isShowCalender: false,
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.datecalender !== this.props.datecalender) {
            let calendarApi = this.calendarComponentRef.current.getApi()
            calendarApi.gotoDate(dateFormat(this.props.datecalender, 'yyyy-mm-dd'))
        }
    }
    toggleWeekends = () => {
        this.setState({ // update a property
            calendarWeekends: !this.state.calendarWeekends
        })
    }

    onEvent(info) {
        this.setState({
            show: true,
            title: info.event.title,
            datestart: dateFormat(info.event.start, "dddd ,  dd mmmm yyyy"),
            timestart: info.event.extendedProps.timestart,
            timeend: info.event.extendedProps.timeend,
            room: info.event.extendedProps.room,
            user: info.event.extendedProps.user,
            id: info.event.id,
            redate: info.event.extendedProps.redate,
            recount: info.event.extendedProps.recount,
            reweek: info.event.extendedProps.reweek,
            user_id: info.event.extendedProps.user_id
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
        var self = this.props;
        confirm({
            title: 'Bạn Muốn Xóa Sự Kiện?',
            content: 'Bạn Có Chắc Chắn',
            onOk() {
                if (cookies.get('data') === undefined) {
                    message.warning('Vui Lòng Đăng Nhập Để Xóa Sự Kiện !')
                } else {
                    if (parseInt(user_id) === parseInt(cookies.get('data').id)) {
                        self.onDelete(id);
                    } else {
                        message.warning('Bạn không có quyền xóa sự kiện này !')
                    }

                }
            },
            onCancel() {
                self.onCancleEdit();
            },
        });
        this.setState({
            show: !this.state.show
        })
    }
    onEdit(id, user_id) {
        var self = this.props;
        confirm({
            title: 'Bạn Muốn Sửa Sự Kiện?',
            content: 'Bạn Có Chắc Chắn',
            onOk() {
                if (cookies.get('data') === undefined) {
                    message.warning('Vui Lòng Đăng Nhập Để Sửa Sự Kiện !')
                } else {
                    if (parseInt(user_id) === parseInt(cookies.get('data').id)) {
                        self.onEdit(id);
                    } else {
                        message.warning('Bạn không có quyền xóa sự kiện này !')
                    }
                }
            },
            onCancel() {
            },
        });
        this.setState({
            show: !this.state.show
        })
    }
    handleDrop = (eventObj, date) => {
        console.group('onDrop');
        console.log('date');
        console.dir(date);
        console.groupEnd();
    }
    onResize = (info) => {
        let data = {
            id: info.event.id,
            timeEnd: dateFormat(info.event.end, 'HH:MM'),
            is_resize: true
        }
        if (cookies.get('data') === undefined) {
            message.warning('Vui Lòng Đăng Nhập Để Sửa Sự Kiện !')
        } else {
            if (parseInt(info.event.extendedProps.user_id) === parseInt(cookies.get('data').id)) {
                this.props.onUpdate(data);
            } else {
                info.revert();
                message.warning('Bạn không có quyền Sửa sự kiện này !')
            }
        }

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
        if (cookies.get('data') === undefined) {
            message.warning('Vui Lòng Đăng Nhập Để Sửa Sự Kiện !')
        } else {
            if (parseInt(eventDropInfo.event.extendedProps.user_id) === parseInt(cookies.get('data').id)) {
                this.props.onUpdate(data);
            } else {
                eventDropInfo.revert();
                message.warning('Bạn không có quyền Sửa sự kiện này !')
            }
        }

    }
    onShowCalender = () => {
        this.setState({
            isShowCalender: !this.state.isShowCalender
        })

    }
    onCloseCanlender = () => {
        this.setState({
            isShowCalender: false
        })
    }
    onSelect = (event) => {
        let calendarApi = this.calendarComponentRef.current.getApi()
        calendarApi.gotoDate(dateFormat(event._d, 'yyyy-mm-dd'))
        this.setState({
            isShowCalender: false
        })
    }
    onCloseModal = () => {
        this.setState({
            show: false
        })
    }
    render() {
        return (
            <div className="b-fullcalender">
                <Modal
                    header={null}
                    visible={this.state.isShowCalender}
                    onOk={this.handleOk}
                    onCancel={this.onCloseCanlender}
                    footer={null}>
                    <div className="b-events">
                        <Calendar fullscreen={false} onSelect={this.onSelect} />
                    </div>
                </Modal>
                <Modal
                    header={null}
                    visible={this.state.show}
                    onOk={this.handleOk}
                    // onCancel={this.handleCancel}
                    footer={null}
                    closable={false}
                >
                    <div className="b-events">
                        {cookies.get('data') !== undefined && parseInt(this.state.user_id) === parseInt(cookies.get('data').id) ?
                            <div className="b-button-funtion">
                                <div className="b-item">
                                    <button className="b-btn" onClick={this.onEdit.bind(this, this.state.id, this.state.user_id)}>
                                        <i className="fas fa-pencil-alt" />
                                    </button>
                                </div>
                                <div className="b-item">
                                    <button className="b-btn" onClick={this.onDelete.bind(this, this.state.id, this.state.user_id)}>
                                        <i className="far fa-trash-alt" />
                                    </button>
                                </div>
                                <div className="b-item" onClick={this.onCloseModal}>
                                    <button className="b-btn">
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            </div> :
                            <div className="b-button-funtion">
                                <div className="b-item">
                                    <button className="b-btn" onClick={this.onCloseModal}>
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        }

                        <div className="b-content">
                            <h2 className="b-text-title">
                                [{this.state.title}]
                            </h2>
                            <p className="b-text-norm">
                                {this.state.datestart} ( {this.state.timestart} - {this.state.timeend} )
                            </p>
                            <span className="b-text-rom">
                                {this.state.room}
                            </span>
                            <p className="b-text-user">
                                {this.state.user}
                            </p>
                            <p className={this.state.redate !== 'Không Lặp' ? "b-text-user" : ''}>
                                {this.state.redate === 'daily' ? 'Lặp Theo Ngày' : ''}
                                {this.state.redate === 'weekly' ? 'Lặp Theo Tuần' : ''}
                                {this.state.redate === 'monthly' ? 'Lặp Theo Tháng' : ''}
                                {this.state.redate === 'yearly' ? 'Lặp Theo Năm' : ''}
                            </p>
                            <p>
                                {this.state.recount ? `${this.state.recount + '  lần lặp lại'}` : ''}
                            </p>
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
                    dayNames={['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']}
                    plugins={[resourceTimeGridPlugin, rrulePlugin, dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                    ref={this.calendarComponentRef}
                    weekends={this.state.calendarWeekends}
                    events={this.props.data}
                    resources={
                        this.props.room
                    }
                    defaultDate={dateFormat(this.state.datenow, 'yyyy-mm-dd')}
                    navLinks
                    editable
                    eventLimit
                    viewObject={{
                        currentStart: '2019-05-07'
                    }}
                    minTime={'07:30:00'}
                    maxTime={'19:30:00'}
                    eventClick={this.onEvent.bind(this)}
                    locales={allLocales}
                    locale={'vi'}
                    eventOverlap={function (stillEvent, movingEvent) {
                        return stillEvent.allDay && movingEvent.allDay;
                    }}
                    eventResize={
                        this.onResize
                    }
                    eventDrop={
                        this.oneventDrop
                    }
                    eventTextColor={'#FEFEF9'}
                    eventBorderColor={'rgba(0,0,0,1.5)'}
                />
            </div>
        );
    }
}

export default FullcalenderComponent;