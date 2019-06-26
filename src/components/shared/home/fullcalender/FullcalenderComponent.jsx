import React, { Component } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list';
import rrsetPlugin from '../../../../libraries/rruleset';
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import allLocales from '@fullcalendar/core/locales-all';
import { Modal, Calendar, Radio, message } from 'antd';
import '../../../../main.scss'
import Cookies from 'universal-cookie';
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
const keyESC = 27;
class FullcalenderComponent extends Component {
    clickCount = 0
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
            room_id: '',
            day: dateFormat(now, 'yyyy-mm-dd')
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.datecalender !== this.props.datecalender) {
            let calendarApi = this.calendarComponentRef.current.getApi()
            calendarApi.gotoDate(dateFormat(this.props.datecalender, 'yyyy-mm-dd'))
        }
        if (this.props.searchDate !== prevProps.searchDate) {
            let calendarApi = this.calendarComponentRef.current.getApi()
            calendarApi.gotoDate(dateFormat(this.props.searchDate, 'yyyy-mm-dd'))
        }

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
            datestart: dateFormat(info.event.start, "dddd, dd mmmm yyyy"),
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
            is_repeat: info.event.extendedProps.is_repeat,
            room_id: info.event.extendedProps.room_id,
            mailto: info.event.extendedProps.mailto
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
        if (e.keyCode === keyESC) {
            this.setState({
                show: false,
            });
        }
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
    componentWillUnmount() {
        this.setState({
            clickCount: 0
        })
    }
    onClickDate = (e) => {
        this.clickCount += 1;
        var self = this;
        if (this.clickCount === 1) {
            setTimeout(function () {
                self.clickCount = 0;
            }, 1000);
        } else if (this.clickCount === 2) {
            if (cookies.get('data') === undefined) {
                message.error('Vui Lòng Đăng Nhập')
            } else {
                if (moment(dateFormat(e.dateStr, 'yyyy-mm-dd HH:MM:ss')).diff(dateFormat(now, 'yyyy-mm-dd HH:MM:ss'), 'minutes') < 0) {
                    message.error('Vui Lòng Chọn Thời Gian Lớn Hơn Thời Gian Hiện Tại');
                    return;
                } else {
                    this.setState({
                        isShowForm: true,
                        dateStart: dateFormat(e.dateStr, 'yyyy-mm-dd'),
                        timestart: dateFormat(e.dateStr, 'HH:MM'),
                        timeend: this.roundMinutesDate(e.dateStr, 30),

                    })
                }
            }
        }
    }
    convertMinsToHrsMins(mins) {
        let h = Math.floor(mins / 60);
        let m = mins % 60;
        h = h < 10 ? '0' + h : h;
        m = m < 10 ? '0' + m : m;
        return `${h}:${m}`;
    }
    render() {
        let dataCurrrent = moment(dateFormat(`${this.state.day} ${this.state.timestart}`, 'yyyy-mm-dd HH:MM:ss')).diff(dateFormat(now, 'yyyy-mm-dd HH:MM:ss'), 'minutes');
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
                                        Xóa tất cả đặt phòng này
                                    </Radio>
                                    <Radio style={radioStyle} value={2}>
                                        Chỉ xóa đặt phòng này
                                    </Radio>
                                </>
                                :
                                <div className="b-check-delete">
                                    <p className="b-text-norm">
                                        <i className="fas fa-exclamation-triangle"></i>  Xóa đặt phòng này
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
                    onCancel={this.handleCancel}
                    footer={null}
                    closable={false}
                    okText="Xác Nhận"
                    cancelText="Hủy"
                    keyboard
                >
                    <div className="b-events">
                        {(cookies.get('data') !== undefined && parseInt(this.state.user_id) === parseInt(cookies.get('data').id) && dataCurrrent > 0) || (cookies.get('data') !== undefined && cookies.get('data').attributes.roles[0] === 'super_admin' && dataCurrrent > 0) ?
                            <div className="b-button-funtion">
                                <div className="b-item">
                                    <Link to={'/' + this.state.id + '/' + this.state.day + '?datestart=' + this.state.day + '&timestart=' + this.state.timestart + '&timeend=' + this.state.timeend + '&room=' + this.state.room_id} className="b-btn">
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
                            </div>
                            :
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
                                Tên sự kiện: {this.state.title}
                            </h2>
                            <p className="b-text-norm">
                                Thời gian: {this.state.datestart} [ {this.state.timestart} - {this.state.timeend} ]
                            </p>
                            <p className={this.state.redate !== 'Không Lặp' ? "b-text-user" : ''} style={{
                                marginTop: '5px'
                            }}>
                                {this.state.redate === 'daily' ? 'Lặp Theo Ngày' : ''}
                                {this.state.redate === 'weekly' ? 'Lặp Theo Tuần' : ''}
                                {this.state.redate === 'monthly' ? 'Lặp Theo Tháng' : ''}
                                {this.state.redate === 'yearly' ? 'Lặp Theo Năm' : ''}
                                {this.state.recount ? ` ${this.state.recount + '  lần lặp lại'}` : ''}
                            </p>
                            <span className="b-text-rom">
                                Địa điểm/Phòng: {this.state.room}
                            </span>
                            <p className="b-text-user" style={{
                                marginTop: '10px'
                            }}>
                                Người tạo: {this.state.user}
                            </p>
                            <span className="b-text-rom">
                                Nội dung/Ghi chú:
                            </span>
                            <p className="b-text-norm" dangerouslySetInnerHTML={{ __html: this.state.content }}>
                            </p>
                        </div>
                    </div>

                </Modal>
                <FullCalendar
                    schedulerLicenseKey={'GPL-My-Project-Is-Open-Source'}
                    defaultView="timeGridWeek"
                    header={{
                        right: 'custom prev,next',
                        center: 'title ',
                        left: 'dayGridMonth,timeGridWeek',
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