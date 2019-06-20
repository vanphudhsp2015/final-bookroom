import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Cookies from 'universal-cookie';
import avatar from '../../../assets/images/avatar.png'
const cookies = new Cookies();
class SiderLayout extends Component {
    onDropdown = (event) => {
        event.preventDefault();
    }
    render() {
        const contentUser = () => {
            if (cookies.get('data') !== undefined) {
                let data = cookies.get('data');
                return (
                    <li>
                        <div className="user-profile">
                            <div className="user-pic">
                                <img className="img-user" src={data.attributes.img === null ? avatar : data.img} alt="img-user" /></div>
                            <div className="user-content">
                                <Link to="/" onClick={this.onDropdown}>
                                    <h5 className="name-title">{data.attributes.name}
                                    </h5>
                                    <span className="user-email text-muted">{data.attributes.email}</span>
                                </Link>
                            </div>
                        </div>
                    </li>
                )
            } else {
                return (
                    <></>
                )
            }
        }
        return (
            <div className="left-menu">
                <ul className="list-menu">
                    {contentUser()}
                    <li className="item-menu">
                        <NavLink className="item-link waves-effect waves-dark" exact={true} activeClassName='active' to="/admin/room">
                            <i className="fas fa-table" />
                            <span className="hide-menu">Danh Sách Phòng</span>
                        </NavLink>
                    </li>
                    <li className="item-menu">
                        <NavLink className="item-link waves-effect waves-dark" exact={true} activeClassName='active' to="/admin/user">
                            <i className="fas fa-table" />
                            <span className="hide-menu">Danh Sách User</span>
                        </NavLink>
                    </li>
                    <li className="item-menu">
                        <NavLink className="item-link waves-effect waves-dark" exact={true} activeClassName='active' to="/admin/event">
                            <i className="fas fa-table" />
                            <span className="hide-menu">Đặt Phòng</span>
                        </NavLink>
                    </li>
                </ul>
            </div>
        );
    }
}

export default SiderLayout;