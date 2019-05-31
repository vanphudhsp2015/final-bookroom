import React, { Component } from 'react';
import { HeaderLayout } from '../../layouts/home';
import { DatePicker, TimePicker, Select, Spin, Modal } from 'antd';
import debounce from 'lodash/debounce';
import moment from 'moment';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import * as action from '../../../actions/events';
import * as actionRoom from '../../../actions/room';
import Cookies from 'universal-cookie';
import { connect } from 'react-redux';
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
class CalenderInfoPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            data: [],
            value: [],
            fetching: false,
            dateStart: dateFormatDate(now, 'yyyy-mm-dd'),
            timestart: dateFormatDate(now, 'HH:MM'),
            timeend: dateFormatDate(now, 'HH:MM'),
            selectRepeat: [
                { id: '2', name: 'Không Lặp Lại' },
                { id: '0', name: 'Tùy Chỉnh' },
                { id: '1', name: 'Hằng Ngày', count: 10 },
            ],
            visible: false,
            repeat: '2',
            byweekday: [],
            choice: 'daily',
            count: 1,
            rooms: this.props.room.length > 0 ? this.props.room[0].id : 1,
            content: "<p>Mô Tả</p>",
            checkbox: false

        };
        this.lastFetchId = 0;
        this.fetchUser = debounce(this.fetchUser, 800);
    }
    componentDidMount() {
        this.props.dispatch(actionRoom.requestGetRoom());
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
        this.setState({
            dateStart: dateString
        })
    }
    onChangeTime = (time, dateString) => {
        this.setState({
            timestart: dateString
        })
    }
    onChangeTimeItem = (time, dateString) => {
        this.setState({
            timeend: dateString
        })
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
        if (event.target.value === '0') {
            this.setState({
                visible: true,
            })
        } else if (event.target.value === '2') {
            this.setState({
                checkbox: false,
                [event.target.name]: event.target.value
            })
        } else if (event.target.value === '1') {
            this.setState({
                [event.target.name]: event.target.value,
                count: 7,
                checkbox: true
            })
        } else {
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
        let data = [...this.state.selectRepeat, { id: '9', name: `${covertName + ` ${this.state.count} Lần `}`, count: this.state.count }]
        this.setState({
            selectRepeat: data,
            repeat: '9',
            visible: false,
            checkbox: true
        })
    }
    onSubmit = (event) => {
        event.preventDefault();
        this.props.dispatch(action.requestAddEvents(this.state));
        this.props.history.push("/");
    }
    render() {
        const { fetching, data, value } = this.state;
        return (
            <div className="wrapper">
                <HeaderLayout ></HeaderLayout>
                <main className="b-page-main">
                    <div className="b-page-calender">
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
                                    <div className="b-group-select">
                                        <div className="b-form-group">
                                            <DatePicker onChange={this.onChangeDate} allowClear={false} defaultValue={moment(this.state.dateStart, dateFormat)} format={dateFormat} />
                                        </div>
                                        <div className="b-form-group">
                                            <TimePicker onChange={this.onChangeTime} allowClear={false} minuteStep={30} defaultValue={moment(this.state.timestart, format)} format={format} />
                                        </div>
                                        <p className="b-text-norm">
                                            Tới
                                        </p>
                                        <div className="b-form-group">
                                            <TimePicker onChange={this.onChangeTimeItem} allowClear={false} minuteStep={30} defaultValue={moment(this.state.timeend, format)} format={format} />
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
                                                <select className='b-input' name="rooms" defaultValue={this.state.rooms} onChange={this.onChanger}>
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
                                                        console.log('Editor is ready to use!', editor);
                                                    }}
                                                    onChange={(event, editor) => {
                                                        const data = editor.getData();
                                                        this.setState({
                                                            content: data
                                                        })
                                                    }}
                                                    onBlur={editor => {
                                                        console.log('Blur.', editor);
                                                    }}
                                                    onFocus={editor => {
                                                        console.log('Focus.', editor);
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