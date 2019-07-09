import React, { Component } from 'react';
import { Link } from 'react-router-dom';
class HeaderLayout extends Component {
  render() {
    return (
      <header className="b-dashboard-header">
        <div className="container-fluid">
          <div className="row">
            <div className="b-header">
              <div className="b-logo">
                <Link to="/">
                  <img
                    src="https://greenglobal.vn/wp-content/themes/gg2019/resources/assets/images/logo-light.svg"
                    alt="logo"
                    className="link-logo" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default HeaderLayout;
