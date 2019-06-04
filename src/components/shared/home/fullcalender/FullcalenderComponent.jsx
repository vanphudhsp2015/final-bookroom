import React, { Component } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list';
// import rrulePlugin from '@fullcalendar/rrule';
import rrsetPlugin from '../../../../libraries/rruleset';
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import allLocales from '@fullcalendar/core/locales-all';
import '../../../../main.scss'
import { Modal, Calendar, Radio, message } from 'antd';
import debounce from 'lodash/debounce';
import Cookies from 'universal-cookie';
import * as typeAPI from '../../../../constants/actionAPI';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import moment from 'moment';
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
            checkbox: false,
            data: [],
            value: [],
            fetching: false,
            isShowDelete: false,
            valueDelete: 1,
            isShowEdit: false,
            isRedirect: false,
            isException: false,
            visible: false,
            dateStart: dateFormat(now, 'yyyy-mm-dd'),
            timestart: this.roundMinutesDate(now, 0),
            timeend: this.roundMinutesDate(now, 60),
            isShowForm: false,
            countClick: 0
        }
        this.lastFetchId = 0;
        this.fetchUser = debounce(this.fetchUser, 800);

    }
    fetchUser = value => {
        var self = this;
        this.setState({ data: [], fetching: true });
        axios.request({
            method: 'GET',
            url: `${typeAPI.API_URL}/api/v1/admin/users`,
            headers: {
                "Accept": "application/json",
                'Content-Type': 'application/json',
                'Authorization': `${'bearer ' + cookies.get('token')}`
            }
        }).then(function (response) {
            const data = response.data.map(data => ({
                text: `${data.attributes.email}`,
                value: `${data.attributes.email}`,
            }));
            self.setState({ data, fetching: false });
        }).catch(function (error) {
            console.log(error)
        })
    };

    handleChange = value => {
        this.setState({
            value,
            data: [],
            fetching: false,
        });
    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.datecalender !== this.props.datecalender) {
            let calendarApi = this.calendarComponentRef.current.getApi()
            calendarApi.gotoDate(dateFormat(this.props.datecalender, 'yyyy-mm-dd'))
        }
        this.interval = setInterval(() => (this.onResetDouble()), 10000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    onResetDouble() {
        this.setState({
            countClick: 0
        })
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
    onEdit(id, user_id) {
        var self = this.props;
        confirm({
            title: 'Bạn Muốn Sửa Sự Kiện?',
            content: 'Bấm Ok để sửa',
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
        console.log('dịch chuyển');

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
    onChangerCheck = (e) => {
        this.setState({
            checkbox: e.target.checked
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
    handleDeleteOk = () => {
        const { id } = this.state;
        var self = this.props;
        if (this.state.valueDelete === 2) {
            self.onDeleteException(this.state);
            this.setState({
                isShowDelete: false,
                show: !this.state.show
            })
        } else {
            self.onDelete(id);
            this.setState({
                isShowDelete: false,
                show: !this.state.show
            })
        }

    }
    onCloseDelete = () => {
        this.setState({
            isShowDelete: false
        })
    }
    onChangeDeleteEvent = (e) => {
        this.setState({
            valueDelete: e.target.value,
        });
    }
    handleEditOk = () => {
        if (this.state.valueDelete === 2) {
            this.setState({
                isShowDelete: false,
                show: !this.state.show,
                isException: true
            })
        } else {
            this.setState({
                isShowDelete: false,
                show: !this.state.show,
                isRedirect: true
            })
        }
    }
    onCloseEdit = () => {
        this.setState({
            isShowEdit: false
        })
    }
    onShowModalEdit = () => {
        this.setState({
            isShowEdit: true
        })
    }
    roundMinutesDate(data, add) {
        const start = moment(data);
        const remainder = 30 - (start.minute() % 30) + add;
        const dateTime = moment(start).add(remainder, "minutes").format("HH:mm");
        return dateTime;
    }
    onChanger = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    onChangeDate = (date, dateString) => {
        if ((moment(dateFormat(dateString, 'yyyy-mm-dd HH:mm')).diff(dateFormat(now, 'yyyy-mm-dd HH:mm'), 'days')) < 0) {
            this.setState({
                validateDate: true
            })
        } else {
            this.setState({
                dateStart: dateString,
                validateDate: false,
            })
        }
    }
    onChangeTime = (time, dateString) => {
        let nowCurrent = dateFormat(this.state.dateStart, 'yyyy-mm-dd');
        if ((moment(`${nowCurrent + ' ' + dateString + ':00'}`)).diff(dateFormat(now, 'yyyy-mm-dd HH:MM:ss'), 'minutes') < 0) {
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
    onChangeTimeItem = (time, dateString) => {
        let nowCurrent = dateFormat(this.state.dateStart, 'yyyy-mm-dd');
        if ((moment(`${nowCurrent + ' ' + dateString + ':00'}`)).diff(dateFormat(now, 'yyyy-mm-dd HH:MM:ss'), 'minutes') < 0) {
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
    onClickDate = (e) => {
        if (cookies.get('data') === undefined) {
            message.error('Vui Lòng Đăng Nhập')
        } else {
            this.setState({
                countClick: this.state.countClick + 1
            })
            if (this.state.countClick === 2) {
                this.setState({
                    isShowForm: true,
                    dateStart: dateFormat(e.dateStr, 'yyyy-mm-dd'),
                    timestart: dateFormat(e.dateStr, 'HH:MM'),
                    timeend: this.roundMinutesDate(e.dateStr, 30),
                })
            }

        }
    }
    render() {
        if (this.state.isShowForm) {
            return <Redirect to={`/new?date=` + this.state.dateStart + `&time=` + this.state.timestart}></Redirect>
        }
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        return (
            <div className="b-fullcalender">
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
                                <>
                                    <Radio style={radioStyle} value={1}>
                                        Xóa Tất Cả Sự Kiện Này
                                    </Radio>
                                    <Radio style={radioStyle} value={2}>
                                        Chỉ Xóa Sự Kiện Này
                                    </Radio>
                                </>
                                :
                                <div className="b-check-delete">
                                    <p className="b-text-norm">
                                        <i className="fas fa-exclamation-triangle"></i>  Xóa Đặt Phòng Này
                                    </p>
                                </div>
                            }

                        </Radio.Group>
                    </div>
                </Modal>
                <Modal
                    header={null}
                    visible={this.state.isShowCalender}
                    onOk={this.handleOk}
                    onCancel={this.onCloseCanlender}
                    footer={null}
                    okText="Xác Nhận"
                    cancelText="Hủy"
                >
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
                    okText="Xác Nhận"
                    cancelText="Hủy"
                >
                    <div className="b-events">
                        {cookies.get('data') !== undefined && parseInt(this.state.user_id) === parseInt(cookies.get('data').id) ?
                            <div className="b-button-funtion">
                                <div className="b-item">
                                    <Link to={'/' + this.state.id + '/' + this.state.day} className="b-btn">
                                        <i className="fas fa-pencil-alt" />
                                    </Link>
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
                            <p className="b-text-norm" dangerouslySetInnerHTML={{ __html: this.state.content }}>
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
                    plugins={[resourceTimeGridPlugin, rrsetPlugin, dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
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
                    eventOverlap={function (stillEvent, movingEvent) {
                        return stillEvent.allDay && movingEvent.allDay;
                    }}
                    eventResize={
                        this.onResize
                    }
                    eventDrop={
                        this.oneventDrop
                    }
                    droppable={false}
                    eventTextColor={'#FEFEF9'}
                    eventBorderColor={'rgba(0,0,0,1.5)'}
                    dateClick={
                        this.onClickDate
                    }
                />
            </div>
        );
    }
}

export default FullcalenderComponent;