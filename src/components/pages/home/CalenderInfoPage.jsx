import React, { Component } from 'react';
import { HeaderLayout } from '../../layouts/home';
import { DatePicker, TimePicker, Select, Modal, message, Radio, InputNumber } from 'antd';
import { SearchComponent } from '../../shared/home';
import moment from 'moment';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as action from '../../../actions/events';
import * as actionRoom from '../../../actions/room';
import { connect } from 'react-redux';
import queryString from 'query-string'
const dateFormat = 'YYYY/MM/DD';
const format = 'HH:mm';
const { Option } = Select;
var dateFormatDate = require('dateformat');
var now = new Date()
const children = [
    { id: '1', name: 'su', title: 'Chủ Nhật' },
    { id: '2', name: 'mo', title: 'Thứ Hai' },
    { id: '3', name: 'tu', title: 'Thứ Ba' },
    { id: '4', name: 'we', title: 'Thứ Tư' },
    { id: '5', name: 'th', title: 'Thứ Năm' },
    { id: '6', name: 'fr', title: 'Thứ Sáu' },
    { id: '7', name: 'sa', title: 'Thứ Bảy' }
];
function disabledHours() {
    return [0, 1, 2, 3, 4, 5, 6, 12, 20, 21, 22, 23, 24];
}
class CalenderInfoPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            data: [],
            value: [],
            fetching: false,
            dateStart: dateFormatDate(now, 'yyyy-mm-dd'),
            timestart: this.roundMinutesDate(now, 0),
            timeend: this.roundMinutesDate(now, 60),
            selectRepeat: [
                { id: '2', name: 'Không lặp lại' },
                { id: '0', name: 'Tùy chỉnh' },
                { id: '3', name: 'Mọi ngày trong tuần từ thứ 2 đến thứ 6' },
                { id: '1', name: 'Hàng ngày', count: 10 },
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
            maxCount: 365
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
        const values = queryString.parse(this.props.location.search)
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
                this.setState({
                    isRepeat: data[0].attributes.repeat !== null ? true : false,
                    id: data[0].id,
                    title: data[0].attributes.title,
                    content: data[0].attributes.content !== null ? data[0].attributes.content : "",
                    dateStart: dateFormatDate(this.props.match.params.date, 'yyyy-mm-dd'),
                    timestart: data[0].attributes.timestart,
                    timeend: data[0].attributes.timeend,
                    count: data[0].attributes.repeat !== null ? data[0].attributes.repeat.count : 1,
                    rooms: data[0].attributes.room.id,
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
    }
    onChangeDate = (date, dateString) => {
        if ((moment(dateFormatDate(dateString, 'yyyy-mm-dd HH:mm')).diff(dateFormatDate(now, 'yyyy-mm-dd HH:mm'), 'days')) < 0) {
            this.setState({
                validateDate: true
            })
        } else {
            this.setState({
                dateStart: dateString,
                timestart: this.roundMinutesDate(now, 0),
                timeend: this.roundMinutesDate(now, 60),
                validateDate: false
            })
        }
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
    onChangeTimeItem = (time, dateString) => {
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
        this.setState({
            visible: false,
            repeat: '1'
        });
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
                    count: 365,
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
                    count: 365,
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
        this.setState({
            visible: false
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
                    count: this.state.count + 1
                })
                break;
            case "monthly":
                covertName = "Lặp lại hàng tháng"
                this.setState({
                    choice: 'monthly'
                })
                this.setState({
                    count: this.state.count + 1
                })
                break;
            case "yearly":
                covertName = "Lặp lại hàng năm"
                this.setState({
                    choice: 'yearly'
                })
                this.setState({
                    count: this.state.count + 1
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
                    count: (this.state.byweekday.length + 1) * this.state.count
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
        if (self.title.trim() === '') {
            message.error('Vui lòng nhập tên tiêu đề cuộc họp !');
        } else {
            if (selfProps.match.params.calender !== undefined) {
                selfThis.setState({
                    isShowEdit: true
                })
            } else {
                selfProps.dispatch(action.requestAddEvents(selfThis.state));
                selfProps.history.push(`/?date=${self.dateStart}`);
            }
        }
    }
    handleEditOk = () => {
        var selfProps = this.props;
        var selfState = this.state;
        if (this.state.valueEdit === 1) {
            selfProps.dispatch(action.requestUpdateEvent(selfState));
            selfProps.history.push(`/?date=${selfState.dateStart}`);
        } else {
            selfProps.dispatch(action.requestEditException(selfState, selfProps.match.params.date, selfState.rooms));
            selfProps.history.push(`/?date=${selfState.dateStart}`);
        }
        this.setState({
            isShowEdit: false
        })
    }
    onCloseEdit = () => {
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
    render() {        
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        return (
            <div className="wrapper">
                <HeaderLayout dateStart={this.state.dateStart} searchDate={this.state.searchDate}></HeaderLayout>
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
                                        <>
                                            <Radio style={radioStyle} value={1}>
                                                Sửa Tất Cả Sự Kiện Này
                                            </Radio>
                                            <Radio style={radioStyle} value={2}>
                                                Chỉ Sửa Sự Kiện Này
                                            </Radio>
                                        </>
                                        :
                                        <>
                                            <Radio style={radioStyle} value={1}>
                                                Sửa  Sự Kiện Này
                                            </Radio>
                                        </>
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
                                                    <select className="b-select" name='choice' value={this.state.choice} onChange={this.onChangerChoice}>
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
                                                            onChange={this.handleChangeByWeek}>
                                                            {children.map(data => (
                                                                <Option key={data.id} value={data.name}>{data.title}</Option>
                                                            ))}
                                                        </Select>
                                                    </div>
                                                    :
                                                    <></>
                                                }

                                                <div className="b-form-group">
                                                    <label >Lặp Lại</label>
                                                    <InputNumber min={this.state.minCount} max={this.state.maxCount} value={this.state.count} onChange={this.onChangeNumber} style={{
                                                        marginLeft: '10px'
                                                    }} />
                                                </div>
                                            </div>
                                            <div className="b-form-button">
                                                <button type="cancel" className="b-btn b-btn-cancel  waves-effect waves-teal" onClick={this.onCancel}>Hủy</button>
                                                <button type="submit" className="b-btn b-btn-save waves-effect waves-teal">Lưu</button>
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
                                        <input type="text" name="title" autoComplete="off" value={this.state.title} placeholder="Nhập tiêu đề" className="b-input" onChange={this.onChanger} />
                                        <span className={this.state.title === '' ? "" : "is-current"}>*</span>
                                    </div>
                                    <div className="b-group-select">
                                        <div className="b-form-group">
                                            <label>Ngày cuộc họp</label>
                                            <br />
                                            <DatePicker className="b-picker" onChange={this.onChangeDate} allowClear={false} value={moment(this.state.dateStart, dateFormat)} format={dateFormat} />
                                            <span className={this.state.validateDate ? "is-error  is-check" : "is-error"}>
                                                * Thời gian lớn hơn hiện tại
                                        </span>
                                        </div>

                                        <div className="b-form-group">
                                            <label>Thời gian bắt đầu</label>
                                            <br />
                                            <TimePicker className="b-picker" hideDisabledOptions disabledHours={disabledHours} onChange={this.onChangeTime} value={moment(this.state.timestart, format)} allowClear={false} minuteStep={30} defaultValue={moment(this.state.timestart, format)} format={format} />
                                            <span className={this.state.validateTime ? "is-error is-check" : "is-error"}>
                                                * Thời gian lớn hơn hiện tại
                                            </span>
                                        </div>
                                        <div className="b-form-group">
                                            <label>Thời gian kết thúc</label>
                                            <br />
                                            <TimePicker className="b-picker" hideDisabledOptions disabledHours={disabledHours} onChange={this.onChangeTimeItem} value={moment(this.state.timeend, format)} allowClear={false} minuteStep={30} defaultValue={moment(this.state.timeend, format)} format={format} />
                                            <span className={this.state.validateTimeItem ? "is-error is-check" : "is-error"}>
                                                * Thời gian lớn hơn hiện tại
                                            </span>
                                        </div>
                                    </div>
                                    <div className="b-select-repeat">
                                        <div className="b-form-group">
                                            <select className="b-select" value={this.state.repeat} name="repeat" onChange={this.onChangerSelectRepeat}>
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
                                            <select className='b-input' name="rooms" value={this.state.rooms} onChange={this.onChanger}>
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
                                                    // You can store the "editor" and use when it is needed.
                                                    // console.log('Editor is ready to use!', editor);
                                                }}
                                                onChange={(event, editor) => {
                                                    const data = editor.getData();
                                                    this.setState({
                                                        content: data
                                                    })
                                                }}
                                                onBlur={editor => {
                                                    // console.log('Blur.', editor);
                                                }}
                                                onFocus={editor => {
                                                    // console.log('Focus.', editor);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <SearchComponent onGetArrayEmail={this.onGetArrayEmail}></SearchComponent>
                        </div>
                    </div>
                </main >
            </div >
        );
    }
}
function mapStateProps(state) {
    return {
        data: state.event.all,
        room: state.room.all
    }
}
export default connect(mapStateProps)(CalenderInfoPage);