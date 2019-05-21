import React, { Component } from 'react';
import { Calendar, Modal } from 'antd';
var dateFormatDate = require('dateformat');

class CardCalenderComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.isCard !== prevProps.isCard) {
            this.setState({
                show: this.props.isCard
            })
        }

    }
    handleClose = () => {
        this.props.onResetCalender();
        this.setState({ show: false });
    }
    handleOk = (e) => {
        this.props.onResetCalender();
        this.setState({
            show: false,
        });
    }

    handleCancel = (e) => {
        this.props.onResetCalender();
        this.setState({
            show: false,
        });
    }
    onPanelChange = (value, mode) => {
        console.log(value, mode);
    }
    onSelect = (value) => {
        this.props.onGetDate(dateFormatDate(value._d, 'yyyy-mm-dd'))
        this.props.onResetCalender();
        this.setState({
            show: false,
        })
    }
    render() {
        return (
            <Modal
                header={null}
                visible={this.state.show}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={null}
            >
                <Calendar onSelect={this.onSelect} fullscreen={false} onPanelChange={this.onPanelChange} />
            </Modal>
        );
    }
}

export default CardCalenderComponent;