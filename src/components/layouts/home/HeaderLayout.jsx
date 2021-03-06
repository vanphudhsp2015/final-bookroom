import React, { Component } from 'react';
import {
  Modal,
  message
} from 'antd';
import { connect } from 'react-redux'
import {
  GoogleLogin,
  GoogleLogout
} from 'react-google-login';
import Cookies from 'universal-cookie';
import * as action from '../../../actions/login';
import {
  Redirect,
  Link
} from 'react-router-dom';
import { API_GG } from '../../../constants/config';
import Logo from '../../../assets/images/logo-light.svg';
import PropTypes from 'prop-types';
const cookies = new Cookies();
class HeaderLayout extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      visible: false,
      is_dropdown: false,
      isLogout: false,
      isRedirect: false,
      dateStart: ''
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.isCheck !== prevProps.isCheck) {
      this.setState({
        visible: this.props.isCheck
      })
    }
  }
  componentDidMount() {
    if (cookies.get('token') === undefined) {
      cookies.remove('accessToken');
      cookies.remove('token');
      cookies.remove('data');
      this.setState({
        isLogout: true
      })
    } else {
      this.props.dispatch(action.requestCheckLogin());
    }
    document.addEventListener('mousedown', this.handleClickOutside);
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }
  onResetLogin = () => {
    this.props.onResetCheckLogin();
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = (e) => {
    this.setState({
      visible: false,
    });
    this.onResetLogin();
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
    this.onResetLogin();
  }
  responseGoogle = (response) => {
    if (response) {
      this.props.dispatch(action.requestGetLogin(response))
      cookies.set('accessToken', response.Zi.access_token, { maxAge: 86400 });
      this.setState({
        visible: false,
        isLogout: false
      });
    }
  }
  error = (response) => {
    message.error(response);
  }
  logout = () => {
    this.props.dispatch(action.requestLogout());
    this.setState({
      isLogout: true
    })
  }
  onShowLogout = () => {
    this.setState({
      is_dropdown: !this.state.is_dropdown
    })
  }
  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({
        is_dropdown: false
      })
    }
  }
  setWrapperRef = (node) => {
    this.wrapperRef = node;
  }
  onRedirect = () => {
    if (cookies.get('data') !== undefined) {
      if (cookies.get('data').attributes.roles[0] !== 'super_admin') {
        this.onMessager()
      }
      else {
        this.setState({
          isRedirect: !this.state.isRedirect
        })
      }
    }
  }
  onMessager = () => {
    message.warning('Bạn không phải Admin');
  }
  logoutGoogle = () => {
    let token = cookies.get('token');
    cookies.remove('token');
    cookies.remove('data');
    cookies.remove('accessToken')
    this.props.dispatch(action.requestLogout(token));
    this.setState({
      isLogout: true
    })
  }
  render() {
    if (this.state.isRedirect) {
      return (
        <Redirect to="/admin/event" />
      )
    }
    const contentLogin = () => {
      if (cookies.get('data') !== undefined) {
        return (
          <React.Fragment>
            {cookies.get('data').attributes.roles[0] === 'super_admin' ?
              <li className="b-item">
                <button
                  className="b-btn"
                  onClick={this.onRedirect}
                >
                  <span className="fas fa-cog" />
                </button>
              </li>
              :
              <React.Fragment />
            }
            <li className={this.state.is_dropdown ? "b-item b-dropdown is-active" : "b-item b-dropdown"}>
              <button className="b-btn" onClick={this.onShowLogout}>
                <img
                  src={cookies.get('data').attributes.img === null ?
                    "https://namtrungsafety.com/wp-content/themes/namtrung/images/customer.png" :
                    cookies.get('data').attributes.img} alt="Admin"
                />
                Xin Chào,{cookies.get('data').attributes.name}
                <span className="fas fa-angle-down" />
              </button>
              <div className="b-hash-menu">
                <div className="b-logout">
                  <GoogleLogout
                    clientId={API_GG}
                    buttonText="Đăng Xuất"
                    onLogoutSuccess={this.logoutGoogle}
                    className="b-logout"
                  />
                </div>
              </div>
            </li>
          </React.Fragment>
        )
      } else {
        return (
          <li className="b-item ">
            <button className="b-btn" onClick={this.showModal}>
              <span className="fas fa-user" />
              Đăng Nhập
            </button>
          </li>
        )

      }
    }
    const contentLogout = () => {
      if (this.state.isLogout) {
        return (
          <li className="b-item ">
            <button className="b-btn" onClick={this.showModal}>
              <span className="fas fa-user" />
              Đăng Nhập
            </button>
          </li>
        )
      } else {
        return (
          <div>
            {contentLogin()}
          </div>
        )

      }
    }
    return (
      <header className="b-page-header" >
        <Modal
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <div className="b-login">
            <div className="b-heading">
              <h2 className="b-text-title">
                Đăng Nhập
              </h2>
            </div>
            <div className="b-content">
              <GoogleLogin
                clientId={API_GG}
                onSuccess={this.responseGoogle}
                onFailure={this.error}
                theme="dark"
                className="b-google"
              />
            </div>
          </div>
        </Modal>
        <div className="b-block">
          <div className="b-block-left">
            <div className="b-icon">
              {this.props.isHome !== true ?
                <Link to={'/'}>
                  <img src={Logo} alt="Logo" />
                </Link> :
                <img src={Logo} alt="Logo" />
              }
            </div>
          </div>
          <div className="b-block-right">
            <div className="b-list-item" ref={this.setWrapperRef}>
              {contentLogout()}
            </div>
          </div>
        </div>
      </header>
    );
  }
}
function mapStateToProps(state) {
  return {
    isLogin: state.login.isLogin,
    isToken: state.login.isToken,
    user: state.login.user
  }
}
HeaderLayout.propTypes = {
  isHome: PropTypes.bool,
  isCheck: PropTypes.bool,
  onResetCheckLogin: PropTypes.func
}
export default connect(mapStateToProps)(HeaderLayout);
