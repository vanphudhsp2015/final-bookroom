import React, { Component } from 'react';
import { Modal } from 'antd';
import Pagination from '../../../../feature/Pagination';
import avatar from '../../../../assets/images/avatar.png'
const confirm = Modal.confirm;
var dateFormat = require('dateformat');
class TableComponent extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            pageOfItems: [],
        }
    }
    onChangePage = (pageOfItems) => {
        // update state with new page of items
        this.setState({ pageOfItems: pageOfItems });
    }
    onChangerView = () => {
        this.props.onChangerView();
    }
    onDelete(id) {
        var self = this.props;
        confirm({
            title: 'Có chắc bạn muốn xóa phòng này?',
            onOk() {
                self.onDelete(id);
            },
            onCancel() {

            },
        });
    }
    onEdit(id) {
        this.props.onEdit(id);
    }
    render() {
        const contentMain = () => {
            switch (this.props.choice) {
                case "ROOM":
                    return (
                        <>
                            <div className="card-body">
                                <div className="header-card">
                                </div>
                                <div className="add-product">
                                    <button className="btn-add" onClick={this.onChangerView}>Thêm</button>
                                </div>
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr className="bg-table">
                                                <th>ID</th>
                                                <th>Tên Phòng </th>
                                                <th>Màu</th>
                                                <th>Chổ Ngồi</th>
                                                <th>Create_at</th>
                                                <th>Update_at</th>
                                                <th>Sửa</th>
                                                <th>Xóa</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.pageOfItems.map(data => (
                                                <tr key={data.id}>
                                                    <td>{data.id}</td>
                                                    <td>{data.attributes.name}</td>
                                                    <td style={{
                                                        display: 'block',
                                                        width: '100px',
                                                        height: '50px',
                                                        background: data.attributes.color,
                                                        borderRadius: '4px'
                                                    }}></td>
                                                    <td>{data.attributes.seats}</td>
                                                    <td>{dateFormat(data.attributes.created_at, "dd-mm-yyyy HH:MM:ss")}</td>
                                                    <td>{dateFormat(data.attributes.updated_at, "dd-mm-yyyy HH:MM:ss")}</td>
                                                    <td>
                                                        <button className="btn_edit" onClick={this.onEdit.bind(this, data.id)}>Edit</button>&nbsp;

                                                </td>
                                                    <td>
                                                        <button
                                                            className="btn_dele"
                                                            onClick={this.onDelete.bind(this, data.id)}>Delete</button>
                                                    </td>
                                                </tr>
                                            ))}

                                        </tbody>
                                    </table>
                                </div>

                            </div>
                            <Pagination items={this.props.data} onChangePage={this.onChangePage}></Pagination>
                        </>
                    )
                case "USER":
                    return (
                        <>
                            <div className="card-body">
                                <div className="header-card">
                                    <div>
                                        <h4 className="card-title">Người Dùng</h4>
                                    </div>
                                </div>

                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr className="bg-table">
                                                <th>ID</th>
                                                <th>Username</th>
                                                <th>Email Address</th>
                                                <th>Roles</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {
                                                this.state.pageOfItems.map(data => (
                                                    <tr key={data.id}>
                                                        <td>{data.id}</td>
                                                        <td >
                                                            <div className="product-name">
                                                                <img className="link-name" src={data.attributes.img === null ? avatar : data.attributes.img} alt="alt-user" />
                                                                <h4 className="b-text">{data.attributes.name}</h4>
                                                            </div>
                                                        </td>
                                                        <td>{data.attributes.email}</td>
                                                        <td>{data.attributes.roles.map((data, item) => (
                                                            <span key={item} className={item % 2 === 0 ? 'b-item' : 'b-item is-current'}>{data} </span>
                                                        ))}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <Pagination items={this.props.data} onChangePage={this.onChangePage}></Pagination>
                        </>
                    )
                default:
                    return (
                        <></>
                    )
            }
        }
        return (
            <div className="add-form">
                <div className="container-fluid">

                    {contentMain()}
                </div>
            </div>
        );
    }
}

export default TableComponent;