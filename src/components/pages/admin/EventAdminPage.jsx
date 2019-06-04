import React, { Component } from 'react';
import { HeaderLayout, SiderLayout, FooterLayout } from '../../layouts/admin';
import { CalenderComponent, FormModalComponent, CardCalenderComponent } from '../../shared/admin';
import { connect } from 'react-redux';
import * as action from '../../../actions/events';
import * as action_Room from '../../../actions/room';
import Cookies from 'universal-cookie';
import { message, DatePicker, TimePicker } from 'antd';
import { Redirect } from 'react-router-dom';
var dateFormatDate = require('dateformat');
const cookies = new Cookies();
const format = 'HH:mm';
const dateFormat = 'YYYY-MM-DD';
var moment = require('moment');
var now = new Date()
function disabledHours() {
    return [0, 1, 2, 3, 4, 5, 6, 7, 12, 18, 19, 20, 21, 22, 23, 24];
}
class EventAdminPage extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            visible: false,
            edit: false,
            dataEdit: {},
            onDate: dateFormatDate(now, 'yyyy-mm-dd'),
            dateStart: dateFormatDate(now, 'yyyy-mm-dd'),
            timestart: '08:30',
            timeend: '09:30',
        }
    }
    componentDidMount() {
        this.onGetData();
    }
    onGetData() {
        this.props.dispatch(action.requestGetEvent());
        this.props.dispatch(action_Room.requestGetRoom());
    }

    convertToFrontEnd(arrA) {
        let arrB = []
        if (arrA.length) {
            arrB = this.convertArray(arrA).map(item => {
                let attributes = item.attributes;
                let excepArray = [];
                attributes.exception.map(data => (
                    excepArray = [...excepArray, `${data.day + ` ${data.timestart} UTC`}`]
                ))
                return {
                    resourceId: attributes.room.id,
                    id: item.id,
                    title: attributes.title,
                    content: attributes.content,
                    className: [
                        attributes.repeat !== null ? `${'room_item_' + attributes.room.id}` : "",
                        cookies.get('data') !== undefined && parseInt(attributes.user_id) === parseInt(cookies.get('data').id) ? "is-current" : "",
                        attributes.repeat !== null ? 'b-repeat' : ''
                    ],
                    start: attributes.daystart,
                    room: attributes.room.name,
                    user: attributes.username,
                    user_id: attributes.user_id,
                    timestart: attributes.timestart,
                    timeend: attributes.timeend,
                    color: attributes.room.color,
                    redate: attributes && attributes.repeat !== null ? attributes.repeat.repeatby : 'Không Lặp',
                    reweek: attributes && attributes.repeat !== null ? attributes.repeat.byweekday : '',
                    recount: attributes && attributes.repeat !== null ? attributes.repeat.count : '',
                    repeat: attributes && attributes.repeat !== null ? '1' : '0',
                    is_repeat: attributes && attributes.repeat !== null ? true : false,
                    rruleSet: attributes && attributes.repeat !== null ?
                        {
                            freq: attributes.repeat.repeatby,
                            interval: attributes.repeat.interval,
                            byweekday: attributes.repeat.byweekday,
                            dtstart: `${attributes.daystart + ' ' + attributes.timestart}`,
                            count: attributes.repeat.count,
                            exrules: excepArray,
                        } : {
                            freq: "daily",
                            interval: 1,
                            dtstart: `${attributes.daystart + ' ' + attributes.timestart}`,
                            count: 1
                        },
                    duration: this.convertMinsToHrsMins(moment(`${attributes.daystart + ' ' + attributes.timeend}`).diff(`${item.attributes.daystart + ' ' + item.attributes.timestart}`, 'minutes'))
                }
            })
        }
        return arrB;
    }
    convertArray(data) {
        let result = [];
        let check = false;
        data.map(item => {
            result = [...result, item]
            let dataItem = item.attributes.exception.map(detail => {
                if (detail.status === 'edit') {
                    check = true
                    return {
                        type: "Bookrooms",
                        id: item.id,
                        attributes: {
                            ...detail,
                            room: item.attributes.room,
                            repeat: null,
                            daystart: detail.day,
                            user_id: item.attributes.user_id,
                            exception: []
                        }

                    }
                } else {
                    return null;
                }

            })
            if (check === true) {
                return result = [...result, ...dataItem]
            } else {
                return null;
            }
        })
        var filterNotNull = result.filter(function (e) {
            return e !== null;
        })
        return filterNotNull;
    }
    convertArrayRoom(arrA) {
        let arrB = []
        if (arrA.length) {
            arrB = arrA.map(item => {
                return {
                    id: item.id,
                    title: item.attributes.name,
                    seats: item.attributes.seats
                }
            })
        }
        return arrB;
    }
    convertMinsToHrsMins(mins) {
        let h = Math.floor(mins / 60);
        let m = mins % 60;
        h = h < 10 ? '0' + h : h;
        m = m < 10 ? '0' + m : m;
        return `${h}:${m}`;
    }
    onDelete = (id) => {
        this.props.dispatch(action.requestDeleteEvent(id));
    }
    onEdit = (id) => {
        let item = [...this.props.data].filter(item => item.id === id);
        if (item.length > 0) {
            this.setState({
                dataEdit: item[0],
                visible: true,
                edit: true
            })
        }

    }
    onUpdate = (data) => {
        this.props.dispatch(action.requestUpdateEvent(data));
        this.setState({
            visible: false,
            edit: false
        })

    }
    onCancleEdit = () => {
        this.setState({
            edit: false
        })
    }
    onAddEvent = (data) => {
        if (cookies.get('data') === undefined) {
            message.warning('Vui Lòng Đăng Nhập Để Được Đặt Lịch !')
        } else {
            this.props.dispatch(action.requestAddEvents(data));
            this.setState({
                visible: false
            })
        }
    }
    onShowModal = () => {
        this.onResetView();
        this.setState({
            visible: true,
            edit: false,
        })
    }
    onCheckModal = () => {
        this.setState({
            visible: false,
            edit: false
        })
    }
    onCalenderCard = () => {
        this.setState({
            isCard: true
        })
    }
    onResetCalender = () => {
        this.setState({
            isCard: false
        })
    }
    onGetDate = (data) => {
        this.setState({
            onDate: data
        })
    }
    onSearchEvent = (event) => {
        event.preventDefault();
        this.props.dispatch(action.requestSearchEvent(this.state));
    }
    onResetView = () => {
        this.setState({
            views: 'VIEW'
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
    onChange = (date, dateString) => {
        this.setState({
            dateStart: dateString
        })
    }
    onReloadData = () => {
        this.onGetData();
    }
    render() {
        if (cookies.get('data') !== undefined) {
            if (cookies.get('data').attributes.roles[0] !== 'super_admin') {
                return (
                    <Redirect to='/'></Redirect>
                )
            }
        } else {
            return (
                <Redirect to='/'></Redirect>
            )
        }
        return (
            <div className="wrapper">
                <FormModalComponent views={this.state.views} onCheckModal={this.onCheckModal} visible={this.state.visible} onUpdate={this.onUpdate} dataEdit={this.state.dataEdit} edit={this.state.edit} onAddEvent={this.onAddEvent} room={this.convertArrayRoom(this.props.room)}></FormModalComponent>
                <HeaderLayout></HeaderLayout>
                <section className="b-dashboard-content">
                    <SiderLayout></SiderLayout>
                    <div className="right-content">
                        <div className="container-fluid">
                            <div className="b-admin-calender">
                                <div className="b-calender">
                                    <div className="b-heading">
                                        <div className="b-block">
                                            <div className="b-block-left">
                                                <CardCalenderComponent onGetDate={this.onGetDate} onResetCalender={this.onResetCalender} isCard={this.state.isCard}></CardCalenderComponent>
                                                <h3 className="b-text-title"  >
                                                    <i className="fas fa-calendar-week" style={{ cursor: 'pointer' }} onClick={this.onCalenderCard}></i> Calender
                                                </h3>
                                            </div>
                                            <div className="b-block-center">
                                                <form className="b-form-filter" onSubmit={this.onSearchEvent}>
                                                    <div className="b-form-group">
                                                        <DatePicker onChange={this.onChange} defaultValue={moment(now, dateFormat)} value={moment(this.state.dateStart, dateFormat)} className="b-input" />
                                                    </div>
                                                    <div className="b-form-group">
                                                        <TimePicker disabledHours={disabledHours} minuteStep={30} defaultValue={moment(this.state.timestart, format)} format={format} onChange={this.onChangeTime} className="b-input" />
                                                    </div>
                                                    <div className="b-form-group">
                                                        <TimePicker disabledHours={disabledHours} minuteStep={30} defaultValue={moment(this.state.timeend, format)} value={moment(this.state.timeend, format)} format={format} onChange={this.onChangeTimeItem} className="b-input" />
                                                    </div>
                                                    <div className="b-form-group">
                                                        <button type="submit" className="b-btn">
                                                            <i className="fas fa-search-location" ></i> Tìm Kiếm
                                                        </button>

                                                    </div>
                                                </form>
                                            </div>
                                            <div className="b-block-right">
                                                <button className="b-btn" onClick={this.onReloadData}>
                                                    <i className="fas fa-plus"></i> Cập Nhật
                                                </button>
                                                <button className="b-btn" onClick={this.onShowModal}>
                                                    <i className="fas fa-plus"></i> Thêm
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="b-content-main">
                                        <CalenderComponent room={this.convertArrayRoom(this.props.room)} onDate={this.state.onDate} onUpdate={this.onUpdate} onEdit={this.onEdit} onDelete={this.onDelete} data={this.convertToFrontEnd(this.props.data)}></CalenderComponent>
                                    </div>
                                </div>


                            </div>
                        </div>
                        <FooterLayout></FooterLayout>
                    </div>

                </section>
            </div>
        );
    }
}
function mapStateProps(state) {
    return {
        data: state.event.all,
        room: state.room.all
    }
}
export default connect(mapStateProps, null)(EventAdminPage);