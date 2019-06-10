import React, { Component } from 'react';
import { DatePicker, TimePicker, Checkbox, InputNumber } from 'antd';
import moment from 'moment';
import 'antd/dist/antd.css';
import { SketchPicker } from 'react-color'
const dateFormat = 'YYYY-MM-DD';
const format = 'HH:mm';
var now = new Date()
class FormComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.dataEdit && this.props.dataEdit.id ? this.props.dataEdit.id : '',
            name: this.props.edit ? this.props.dataEdit.attributes.name : '',
            seat: this.props.edit ? this.props.dataEdit.attributes.seats : '1',
            content: '',
            id_rooms: '',
            nameuser: '',
            daystart: '',
            timestart: '07:30',
            timeend: '08:30',
            repeat: '',
            checkbox: false,
            displayColorPicker: false,
            background: this.props.edit ? this.props.dataEdit.attributes.color : '#B8E986',
        }
    }
    onChanger = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    onSubmitRoom = (event) => {
        event.preventDefault();
        if (this.props.edit) {
            this.props.onUpdate(this.state);
            this.onReset();
        } else {
            this.props.onAdd(this.state);
            this.onReset();
        }

    }

    onChangeDate = (date, dateString) => {
        this.setState({
            daystart: dateString
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
    onChangeCheck = (e) => {
        this.setState({
            checkbox: e.target.checked
        })
    }
    submitBook = (event) => {
        event.preventDefault();
        this.props.onAddBook(this.state);
    }
    onReset() {
        this.setState({
            name: '',
            seat: '1',
        })
    }
    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false })
    };

    handleChangeComplete = (color) => {
        this.setState({ background: color.hex });
    };
    onChangeNumber = (value) => {
        this.setState({
            seat: value
        })
    }
    render() {
        const contentMain = () => {
            switch (this.props.choice) {
                case "ROOM":
                    return (
                        <form className="form-horizontal form-material" onSubmit={this.onSubmitRoom}>
                            <div className="form-group">
                                <label className="text-contact">Tên Phòng </label>
                                <input
                                    onChange={this.onChanger}
                                    name="name"
                                    value={this.state.name}
                                    className="form-control"
                                    type="text"
                                    placeholder="Bạn vui lòng nhập tên phòng!" required/>
                            </div>
                            <div className="form-group">
                                <label className="text-contact">Số Chổ Ngồi </label><br />
                                <InputNumber style={{
                                    width: "100%"
                                }} className="form-control" min={1} max={200} value={this.state.seat} onChange={this.onChangeNumber} />
                            </div>
                            <div className="form-group">
                                <label className="text-contact">Mã Màu Phòng</label>
                                <div>
                                    <SketchPicker
                                        color={this.state.background}
                                        onChangeComplete={this.handleChangeComplete}
                                    />

                                </div>
                            </div>
                            <div className="form-group">
                                <button className="btn btn-success">Save</button>
                            </div>
                        </form>
                    )
                case "BOOK":
                    return (
                        <form className="form-horizontal form-material" onSubmit={this.submitBook}>
                            <div className="form-group">
                                <label className="text-contact">Content</label>
                                <input
                                    value={this.state.content}
                                    onChange={this.onChanger}
                                    name="content"
                                    className="form-control"
                                    type="text" />
                            </div>

                            <div className="form-group">
                                <label className="text-contact">Id_Room</label>
                                <select className="form-control" name="id_rooms" onChange={this.onChanger} defaultValue="2">

                                    {
                                        this.props.rooms.map(data => (
                                            <option className="city">{data.id}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="text-contact">NameUser</label>
                                <input
                                    value={this.state.nameuser}
                                    onChange={this.onChanger}
                                    name="nameuser"
                                    className="form-control"
                                    type="text" />
                            </div>

                            <div className="form-group">
                                <div><label className="text-contact">DayStart</label></div>
                                <DatePicker style={{ width: '100%' }} onChange={this.onChangeDate} defaultValue={moment(now, dateFormat)} />
                            </div>
                            <div className="form-group">
                                <div><label className="text-contact">TimeStart</label></div>

                                <TimePicker minuteStep={30} style={{ width: '100%' }} defaultValue={moment(this.state.timestart, format)} format={format} onChange={this.onChangeTime} />
                            </div>
                            <div className="form-group">
                                <div><label className="text-contact">TimeEnd</label></div>

                                <TimePicker minuteStep={30} style={{ width: '100%' }} defaultValue={moment(this.state.timeend, format)} value={moment(this.state.timeend, format)} format={format} onChange={this.onChangeTimeItem} />,
                            </div>
                            <div className="form-group">
                                <Checkbox name="checkbox" onChange={this.onChangeCheck} value={this.state.checkbox}></Checkbox>
                                <label className="text-contact" style={{ paddingLeft: '20px' }}>Repeat</label>
                            </div>

                            <div className="form-group">
                                <button className="btn btn-success" >Save</button>
                            </div>
                        </form>
                    )
                default:
                    return <></>
            }
        }
        return (
            <div className="edit-form ">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="b-card">
                                <div className="card-body">
                                    {contentMain()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default FormComponent;