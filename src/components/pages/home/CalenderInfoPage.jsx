import React, { Component } from 'react';
import { HeaderLayout } from '../../layouts/home';
import { DatePicker, TimePicker, Select, Spin, Modal, message, Radio } from 'antd';
import debounce from 'lodash/debounce';
import moment from 'moment';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import * as action from '../../../actions/events';
import * as actionRoom from '../../../actions/room';
import Cookies from 'universal-cookie';
import { connect } from 'react-redux';
import queryString from 'query-string'
const cookies = new Cookies();
const dateFormat = 'YYYY/MM/DD';
const format = 'HH:mm';
const { Option } = Select;
var dateFormatDate = require('dateformat');
var now = new Date()
const children = [
    { id: '1', name: 'su' },
    { id: '2', name: 'mo' },
    { id: '3', name: 'tu' },
    { id: '4', name: 'we' },
    { id: '5', name: 'th' },
    { id: '6', name: 'fr' },
    { id: '7', name: 'sa' }
];
const env = process.env || {}
function disabledHours() {
    return [0, 1, 2, 3, 4, 5, 6, 7, 12, 18, 19, 20, 21, 22, 23, 24];
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
                { id: '2', name: 'Không Lặp Lại' },
                { id: '0', name: 'Tùy Chỉnh' },
                { id: '8', name: 'Ngày Này Tháng Sau' },
                { id: '9', name: 'Ngày Này Năm Sau' },
                { id: '10', name: 'Ngày Này Tuần Sau' },
                { id: '1', name: 'Hằng Ngày', count: 10 },
            ],
            visible: false,
            repeat: '2',
            byweekday: [],
            choice: 'daily',
            count: 1,
            rooms: this.props.room.length > 0 ? this.props.room[0].id : 1,
            content: "<p>Mô Tả</p>",
            checkbox: false,
            validateDate: false,
            validateTime: false,
            validateTimeItem: false,
            isShowEdit: false,
            valueEdit: 1,
            isRepeat: false

        };
        this.lastFetchId = 0;
        this.fetchUser = debounce(this.fetchUser, 800);
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
                    content: data[0].attributes.content,
                    dateStart: dateFormatDate(this.props.match.params.date, 'yyyy-mm-dd'),
                    timestart: data[0].attributes.timestart,
                    timeend: data[0].attributes.timeend,
                    repeat: data[0].attributes.repeat !== null ? '12' : '2',
                    count: data[0].attributes.repeat !== null ? data[0].attributes.repeat.count : 1,
                    rooms: data[0].attributes.room.id,
                    checkbox: data[0].attributes.repeat !== null ? true : false,
                    choice: data[0].attributes.repeat !== null ? data[0].attributes.repeat.repeatby : 'daily'
                })

            }
        }
        if (this.props.match.params.exception) {
            if (this.props.data !== prevProps.data) {
                let data = this.props.data.filter(item => parseInt(item.id) === parseInt(this.props.match.params.exception))
                if (data[0].attributes.repeat !== null) {
                    this.onAddSelectDate(data[0].attributes.repeat.repeatby, data[0].attributes.repeat.count)
                }
                this.setState({
                    id: data[0].id,
                    title: data[0].attributes.title,
                    content: data[0].attributes.content,
                    dateStart: dateFormatDate(this.props.match.params.date, 'yyyy-mm-dd'),
                    timestart: data[0].attributes.timestart,
                    timeend: data[0].attributes.timeend,
                    repeat: data[0].attributes.repeat !== null ? '12' : '2',
                    count: data[0].attributes.repeat !== null ? data[0].attributes.repeat.count : 1,
                    rooms: data[0].attributes.room.id,
                    checkbox: data[0].attributes.repeat !== null ? true : false,
                    choice: data[0].attributes.repeat !== null ? data[0].attributes.repeat.repeatby : 'daily'
                })

            }
        }

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

    handleChange = value => {
        this.setState({
            value,
            data: [],
            fetching: false,
        });
    };
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
                validateDate: false,
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
                    count: 7,
                    checkbox: true
                })
                break;
            case '2':
                this.setState({
                    checkbox: false,
                    [event.target.name]: event.target.value
                })
                break;
            case '8':
                this.setState({
                    [event.target.name]: event.target.value,
                    count: 2,
                    checkbox: true,
                    choice: 'monthly'
                })
                break;
            case '9':
                this.setState({
                    [event.target.name]: event.target.value,
                    count: 2,
                    checkbox: true,
                    choice: 'yearly'
                })
                break;
            case '10':
                let dateOfWeek = '';
                switch (dateFormatDate(now, 'ddd').trim()) {
                    case 'T2':
                        dateOfWeek = 'mo';
                        break;
                    case 'T3':
                        dateOfWeek = 'tu';
                        break;
                    case 'T4':
                        dateOfWeek = 'we';
                        break;
                    case 'T5':
                        dateOfWeek = 'th';
                        break;
                    case 'T6':
                        dateOfWeek = 'fr';
                        break;
                    case 'T7':
                        dateOfWeek = 'sa';
                        break;
                    case 'CN':
                        dateOfWeek = 'su';
                        break;
                    default:
                        dateOfWeek = 'mo';
                }
                this.setState({
                    [event.target.name]: event.target.value,
                    count: 2,
                    checkbox: true,
                    choice: 'weekly',
                    byweekday: [dateOfWeek]

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
                covertName = "Lặp Lại Hằng Ngày "
                break;
            case "monthly":
                covertName = "Lặp Lại  Hằng Tháng "
                break;
            case "yearly":
                covertName = "Lặp Lại  Hằng Năm "
                break;
            case "weekly":
                let nameWeek = '';
                this.state.byweekday.forEach((i, index, item) => {
                    if (index === item.length - 1) {
                        nameWeek += `${item[index]}`;
                    } else {
                        nameWeek += `${item[index]},`;
                    }
                })
                covertName = `Các Ngày ${nameWeek} Trong Tuần`
                break;
            default:
                covertName = 'daily'
                break;
        }
        let data = [...this.state.selectRepeat, { id: '99', name: `${covertName + ` ${this.state.count} Lần `}`, count: this.state.count }]
        this.setState({
            selectRepeat: data,
            repeat: '99',
            visible: false,
            checkbox: true
        })
    }
    onAddSelectDate(choice, count) {
        let covertName = '';
        switch (choice) {
            case "daily":
                covertName = "Lặp Lại Hằng Ngày "
                break;
            case "monthly":
                covertName = "Lặp Lại  Hằng Tháng "
                break;
            case "yearly":
                covertName = "Lặp Lại  Hằng Năm "
                break;
            case "weekly":
                let nameWeek = '';
                this.state.byweekday.forEach((i, index, item) => {
                    if (index === item.length - 1) {
                        nameWeek += `${item[index]}`;
                    } else {
                        nameWeek += `${item[index]},`;
                    }
                })
                covertName = `Các Ngày ${nameWeek} Trong Tuần`
                break;
            default:
                covertName = 'daily'
                break;
        }
        let data = [...this.state.selectRepeat, { id: '12', name: `${covertName + ` ${count} Lần `}`, count: count }]
        this.setState({
            selectRepeat: data,
            repeat: '9',
            visible: false,
            checkbox: true
        })
    }
    onSubmit = (event) => {
        event.preventDefault();
        if (this.state.title.length <= 0) {
            message.error('Vui Lòng Kiểm Tra Thông Tin Nhập');
        } else {
            if (this.props.match.params.calender !== undefined) {
                this.setState({
                    isShowEdit: true
                })

            } else {
                this.props.dispatch(action.requestAddEvents(this.state));
                this.props.history.push("/");
            }


        }
    }
    handleEditOk = () => {
        if (this.state.valueEdit === 1) {
            this.props.dispatch(action.requestUpdateEvent(this.state));
            this.props.history.push("/");
        } else {
            this.props.dispatch(action.requestEditException(this.state, this.props.match.params.date));
            this.props.history.push("/");
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
    render() {

        const { fetching, data, value } = this.state;
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        return (
            <div className="wrapper">
                <HeaderLayout ></HeaderLayout>
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
                                                            onChange={this.handleChangeByWeek}>
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
                                                        <option value={20}>20</option>
                                                    </select>
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
                                        <input type="text" name="title" value={this.state.title} placeholder="Thêm Tiêu Đề" className="b-input" onChange={this.onChanger} />
                                    </div>
                                    <span className={this.state.title.length > 0 ? "is-error" : "is-error is-check"}>
                                        * Vui Lòng Điền Tên Cuộc Họp
                                    </span>
                                    <div className="b-group-select">
                                        <div className="b-form-group">
                                            <DatePicker onChange={this.onChangeDate} allowClear={false} value={moment(this.state.dateStart, dateFormat)} format={dateFormat} />
                                            <span className={this.state.validateDate ? "is-error  is-check" : "is-error"}>
                                                * Thời Gian Lớn Hơn Hiện Tại
                                        </span>
                                        </div>

                                        <div className="b-form-group">
                                            <TimePicker hideDisabledOptions disabledHours={disabledHours} onChange={this.onChangeTime} value={moment(this.state.timestart, format)} allowClear={false} minuteStep={30} defaultValue={moment(this.state.timestart, format)} format={format} />
                                            <span className={this.state.validateTime ? "is-error is-check" : "is-error"}>
                                                * Thời Gian Lớn Hơn Hiện Tại
                                        </span>
                                        </div>

                                        <p className="b-text-norm">
                                            Tới
                                        </p>
                                        <div className="b-form-group">
                                            <TimePicker hideDisabledOptions disabledHours={disabledHours} onChange={this.onChangeTimeItem} value={moment(this.state.timeend, format)} allowClear={false} minuteStep={30} defaultValue={moment(this.state.timeend, format)} format={format} />
                                            <span className={this.state.validateTimeItem ? "is-error is-check" : "is-error"}>
                                                * Thời Gian Lớn Hơn Hiện Tại
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
                                <div className="b-description-right">
                                    <div className="b-heading">
                                        <h2 className="b-text-title">
                                            khách
                                        </h2>
                                    </div>
                                    <div className="b-description-content">
                                        <Select
                                            mode="multiple"
                                            labelInValue
                                            value={value}
                                            placeholder="Select users"
                                            notFoundContent={fetching ? <Spin size="small" /> : null}
                                            filterOption={false}
                                            onSearch={this.fetchUser}
                                            onChange={this.handleChange}
                                            style={{ width: '100%' }}
                                        >
                                            {data.map(d => (
                                                <Option key={d.value}>{d.text}</Option>
                                            ))}
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </main>
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
export default connect(mapStateProps)(CalenderInfoPage);