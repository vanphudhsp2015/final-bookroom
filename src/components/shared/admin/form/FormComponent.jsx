import React, { Component } from 'react';
import { InputNumber } from 'antd';
import 'antd/dist/antd.css';
import { SketchPicker } from 'react-color'
import PropTypes from 'prop-types';
class FormComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.dataEdit && this.props.dataEdit.id ? this.props.dataEdit.id : '',
            name: this.props.edit ? this.props.dataEdit.attributes.name : '',
            seat: this.props.edit ? this.props.dataEdit.attributes.seats : '1',
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
    onReset() {
        this.setState({
            id: this.props.dataEdit && this.props.dataEdit.id ? this.props.dataEdit.id : '',
            name: this.props.edit ? this.props.dataEdit.attributes.name : '',
            seat: this.props.edit ? this.props.dataEdit.attributes.seats : '1',
            background: this.props.edit ? this.props.dataEdit.attributes.color : '#B8E986',
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
                                    placeholder="Bạn vui lòng nhập tên phòng!" required />
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
FormComponent.propTypes = {
    onAdd: PropTypes.func,
    onUpdate: PropTypes.func,
    dataEdit: PropTypes.object,
    edit: PropTypes.bool
}
export default FormComponent;