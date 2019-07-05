import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MasterLayout } from '../../layouts/admin';
import { TableComponent, FormComponent } from '../../shared/admin';
import * as action from '../../../actions/room';
import PropTypes from 'prop-types';
class RoomPage extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            views: 'LIST',
            dataEdit: {},
            edit: false
        }
    }
    componentDidMount() {
        this.props.dispatch(action.requestGetRoom());
    }
    onChangerView = () => {
        this.setState({
            views: 'FORM'
        })
    }
    onDelete = (id) => {
        this.props.dispatch(action.requestDeleteRoom(id));
    }

    onAdd = (data) => {
        this.props.dispatch(action.requestAddRoom(data));
        this.setState({
            views: "LIST"
        })

    }
    onEdit = (id) => {
        let item = [...this.props.data].filter(item => item.id === id)
        if (item.length > 0) {
            this.setState({
                dataEdit: item[0],
                views: 'FORM',
                edit: true
            })
        }
    }
    onUpdate(data) {
        this.props.dispatch(action.requestEditRoom(data));
        this.setState({
            views: "LIST",
            edit: false
        })
    }
    render() {
        const mainContent = () => {
            switch (this.state.views) {
                case "LIST":
                    return (
                        <TableComponent onEdit={this.onEdit} choice="ROOM" onDelete={this.onDelete} data={this.props.data} onChangerView={this.onChangerView}></TableComponent>
                    )
                case "FORM":
                    return (
                        <FormComponent choice="ROOM" onUpdate={this.onUpdate.bind(this)} edit={this.state.edit} dataEdit={this.state.dataEdit} onAdd={this.onAdd} ></FormComponent>
                    )
                default:
                    return (
                        <></>
                    )
            }
        }
        return (
            <MasterLayout>
                {mainContent()}
            </MasterLayout>
        );
    }
}
function mapStateProps(state) {
    return {
        data: state.room.all,
    }
}
RoomPage.propTypes = {
    data: PropTypes.array
}
export default connect(mapStateProps, null)(RoomPage);
