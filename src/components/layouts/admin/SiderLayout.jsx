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
                <img
                  className="img-user"
                  src={data.attributes.img === null ? avatar : data.img}
                  alt="img-user"
                />
              </div>
              <div className="user-content">
                <Link to="/" onClick={this.onDropdown}>
                  <span className="name-title">{data.attributes.name}</span>
                  <span className="user-email text-muted">{data.attributes.email}</span>
                </Link>
              </div>
            </div>
          </li>
        )
      } else {
        return (
          <React.Fragment />
        )
      }
    }
    return (
      <div className="left-menu">
        <ul className="list-menu">
          {contentUser()}
          <li className="item-menu">
            <NavLink
              className="item-link waves-effect waves-dark"
              exact
              activeClassName='active'
              to="/admin/room"
            >
              <span className="fab fa-buromobelexperte" />
              <span className="hide-menu">Danh Sách Phòng</span>
            </NavLink>
          </li>
          <li className="item-menu">
            <NavLink
              className="item-link waves-effect waves-dark"
              exact
              activeClassName='active'
              to="/admin/user"
            >
              <span className="fas fa-users" />
              <span className="hide-menu">Danh Sách User</span>
            </NavLink>
          </li>
          <li className="item-menu">
            <NavLink
              className="item-link waves-effect waves-dark"
              exact
              activeClassName='active'
              to="/admin/event"
            >
              <span className="fas fa-book-reader" />
              <span className="hide-menu">Đặt Phòng</span>
            </NavLink>
          </li>
        </ul>
      </div>
    );
  }
}

export default SiderLayout;
