import React, { Component } from 'react';
import { connect } from 'react-redux'
import { HeaderLayout, SlideBar } from '../../layouts/home';
import { FullcalenderComponent } from '../../shared/home';
import * as action from '../../../actions/events';
import * as action_Room from '../../../actions/room';
import Cookies from 'universal-cookie';
import { message } from 'antd';
// import { RRule, RRuleSet, rrulestr } from 'rrule'
const cookies = new Cookies();
// var dateFormatDate = require('dateformat');
var moment = require('moment');
// var now = new Date()
// const rruleSet = new RRuleSet()
// rruleSet.rrule(new RRule({
//     freq: RRule.DAILY,
//     count: 5,
//     dtstart: new Date(Date.UTC(2019, 5, 29))
// }))
// rruleSet.exdate(new Date(Date.UTC(2019, 5, 31)))

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
            isLogin: false
        }
    }
    componentDidMount() {
        this.onGetData();
        // this.interval = setInterval(() => (this.onGetData()), 20000);
    }
    onGetData() {
        this.props.dispatch(action.requestGetEvent());
        this.props.dispatch(action_Room.requestGetRoom());
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    onAddEvent = (data) => {
        if (cookies.get('data') === undefined) {
            message.warning('Vui Lòng Đăng Nhập Để Được Đặt Lịch !')
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
            arrB = arrA.map(item => {
                let attributes = item.attributes;
                return {
                    resourceId: attributes.room.id,
                    id: item.id,
                    title: attributes.content,
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
                    rrule: attributes && attributes.repeat !== null ?
                        {
                            freq: attributes.repeat.repeatby,
                            interval: attributes.repeat.interval,
                            byweekday: attributes.repeat.byweekday,
                            dtstart: `${attributes.daystart + ' ' + attributes.timestart}`,
                            count: attributes.repeat.count
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
    onChangerRoom = (data) => {
        if (data === 0) {
            this.props.dispatch(action.requestGetEvent());
        } else {
            this.props.dispatch(action.requestGetEventByRoom(data));
        }
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
    render() {
        // console.log(rruleSet.all());

        return (
            <div className="wrapper">
                <HeaderLayout onResetCheckLogin={this.onResetCheckLogin} isCheck={this.state.isLogin}></HeaderLayout>
                <main className="b-page-main">
                    <div className="b-block">
                        <SlideBar onCheckLogin={this.onCheckLogin} room={this.props.room} onCancleEdit={this.onCancleEdit} onChangerRoom={this.onChangerRoom} onUpdate={this.onUpdate} dataEdit={this.state.dataEdit} edit={this.state.edit} onGetDate={this.onGetDate} onAddEvent={this.onAddEvent}></SlideBar>
                        <div className="b-block-right">
                            <FullcalenderComponent rooms={this.props.room} room={this.convertArrayRoom(this.props.room)} onCancleEdit={this.onCancleEdit} onUpdate={this.onUpdate} onEdit={this.onEdit} onDelete={this.onDelete} is_checkdate={this.state.is_getdate} datecalender={this.state.datecalender} data={this.convertToFrontEnd(this.props.data)}></FullcalenderComponent>
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
        fetched: state.event.fetched
    }
}
export default connect(mapStateProps, null)(HomePage);
