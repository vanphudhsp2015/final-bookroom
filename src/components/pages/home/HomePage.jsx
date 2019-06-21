import React, { Component } from 'react';
import { connect } from 'react-redux'
import { HeaderLayout, SlideBar } from '../../layouts/home';
import { FullcalenderComponent } from '../../shared/home';
import * as action from '../../../actions/events';
import * as action_Room from '../../../actions/room';
import queryString from 'query-string'
import Cookies from 'universal-cookie';
import { message } from 'antd';
const cookies = new Cookies();
var moment = require('moment');

class HomePage extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            visible: false,
            calender: [],
            is_getdate: false,
            datecalender: '',
            edit: false,
            dataEdit: {},
            is_edit: false,
            isLogin: false,
            searchDate: ''
        }
    }
    componentDidMount() {
        var timeout = null;
        clearTimeout(timeout);
        var self = this;
        timeout = setTimeout(function () {
            self.onGetData();
        }, 700);
        if (this.props.location !== undefined) {
            const values = queryString.parse(this.props.location.search)
            this.setState({
                searchDate: values.date,
            })
        }
    }

    onGetData() {
        this.props.dispatch(action.requestGetEvent());
        this.props.dispatch(action_Room.requestGetRoom());
    }
    onAddEvent = (data) => {
        if (cookies.get('data') === undefined) {
            message.warning('Vui Lòng Đăng Nhập Để Được Đặt Phòng !')
        } else {
            this.props.dispatch(action.requestAddEvents(data));
        }
    }
    onGetDate = (data) => {
        this.setState({
            is_getdate: !this.state.is_getdate,
            datecalender: data
        })
    }
    onDelete = (id) => {
        if (cookies.get('data') === undefined) {
            message.warning('Vui Lòng Đăng Nhập Để Xóa  Sự Kiện !')
        } else {
            this.props.dispatch(action.requestDeleteEvent(id));

        }
    }
    onEdit = (id) => {
        let item = [...this.props.data].filter(item => item.id === id);
        if (item.length > 0) {
            this.setState({
                dataEdit: item[0],
                edit: true
            })
        }

    }
    onUpdate = (data) => {
        this.props.dispatch(action.requestUpdateEvent(data));
        this.setState({
            edit: false
        })

    }
    onCancleEdit = () => {
        this.setState({
            edit: false
        })
    }
    onChangerRoom = (data) => {
        if (data === 0) {
            this.props.dispatch(action.requestGetEvent());
        } else {
            this.props.dispatch(action.requestGetEventByRoom(data));
        }
    }
    onEdit = (id) => {
        let item = [...this.props.data].filter(item => item.id === id);
        if (item.length > 0) {
            this.setState({
                dataEdit: item[0],
                edit: true
            })
        }

    }
    onUpdate = (data) => {
        this.props.dispatch(action.requestUpdateEvent(data));
        this.setState({
            edit: false
        })
    }
    onCancleEdit = () => {
        this.setState({
            edit: false
        })
    }
    convertMinsToHrsMins(mins) {
        let h = Math.floor(mins / 60);
        let m = mins % 60;
        h = h < 10 ? '0' + h : h;
        m = m < 10 ? '0' + m : m;
        return `${h}:${m}`;
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
                    room_id: attributes.room.id,
                    user: attributes.username,
                    user_id: attributes.user_id,
                    timestart: attributes.timestart,
                    timeend: attributes.timeend,
                    color: attributes.room.color,
                    mailto: attributes.mailto,
                    redate: attributes && attributes.repeat !== null ? attributes.repeat.repeatby : 'Không Lặp',
                    reweek: attributes && attributes.repeat !== null ? attributes.repeat.byweekday : '',
                    recount: attributes && attributes.repeat !== null ? attributes.repeat.count : '',
                    repeat: attributes && attributes.repeat !== null ? '1' : '0',
                    is_repeat: (attributes && attributes.repeat !== null) || (attributes && attributes.checkRepeat === true) ? true : false,
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
    convertArrayRoom(arrA) {
        let arrB = []
        if (arrA.length) {
            arrB = arrA.map(item => {
                return {
                    id: item.id,
                    title: item.attributes.name,
                }
            })
        }
        return arrB;
    }
    onCheckLogin = () => {
        this.setState({
            isLogin: true
        })
    }
    onResetCheckLogin = () => {
        this.setState({
            isLogin: false
        })
    }
    onDeleteException = (data) => {
        this.props.dispatch(action.requestDeleteException(data));
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
                            room: {
                                id: detail.room_id,
                                title: detail.name,
                                color: detail.color
                            },
                            repeat: null,
                            checkRepeat: true,
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
    roundMinutesDate(data, add) {
        const start = moment(data);
        const remainder = 30 - (start.minute() % 30) + add;
        const dateTime = moment(start).add(remainder, "minutes").format("HH:mm");
        return dateTime;
    }
    render() {
        return (
            <div className="wrapper">
                <HeaderLayout isHome={true} onResetCheckLogin={this.onResetCheckLogin} isCheck={this.state.isLogin}></HeaderLayout>
                <main className="b-page-main">
                    <div className="b-block">
                        <SlideBar onCheckLogin={this.onCheckLogin} room={this.props.room} onCancleEdit={this.onCancleEdit} onChangerRoom={this.onChangerRoom} onUpdate={this.onUpdate} dataEdit={this.state.dataEdit} edit={this.state.edit} onGetDate={this.onGetDate} onAddEvent={this.onAddEvent}></SlideBar>
                        <div className="b-block-right">
                            <FullcalenderComponent searchDate={this.state.searchDate} onAddEvent={this.onAddEvent} onDeleteException={this.onDeleteException} rooms={this.props.room} room={this.convertArrayRoom(this.props.room)} onCancleEdit={this.onCancleEdit} onUpdate={this.onUpdate} onEdit={this.onEdit} onDelete={this.onDelete} is_checkdate={this.state.is_getdate} datecalender={this.state.datecalender} data={this.convertToFrontEnd(this.props.data)}></FullcalenderComponent>
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}
function mapStateProps(state) {
    return {
        data: state.event.all,
        room: state.room.all,
    }
}
export default connect(mapStateProps, null)(HomePage);
