import React, { Component } from 'react';
import { Modal, message } from 'antd';
import { connect } from 'react-redux'
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import Cookies from 'universal-cookie';
import * as action from '../../../actions/login';
import { Redirect, Link } from 'react-router-dom';
import { API_GG } from '../../../constants/config';
import Logo from '../../../assets/images/logo-light.svg'
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
        // console.log(response);

        if (response) {
            this.props.dispatch(action.requestGetLogin(response))
            cookies.set('accessToken', response.Zi.access_token);
            this.setState({
                visible: false,
                isLogout: false
            });
        }
    }
    error = (response) => {
        console.error("error " + response) // eslint-disable-line
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
        this.props.dispatch(action.requestLogout(cookies.remove('accessToken')));
        this.setState({
            isLogout: true
        })
    }

    render() {
        if (this.state.isRedirect) {
            return (
                <Redirect to="/admin/event"></Redirect>
            )
        }
        const contentLogin = () => {
            if (cookies.get('data') !== undefined) {
                return (
                    <>
                        {cookies.get('data').attributes.roles[0] !== 'super_admin' ?
                            <></>
                            :
                            <li className="b-item">
                                <button className="b-btn" onClick={this.onRedirect}><i className="fas fa-cog" style={{
                                    transform: 'translateY(3px)'
                                }} /></button>
                            </li>
                        }
                        <li className={this.state.is_dropdown ? "b-item b-dropdown is-active" : "b-item b-dropdown"}>
                            <button className="b-btn" onClick={this.onShowLogout}>
                                <img src={cookies.get('data').attributes.img === null ? "https://namtrungsafety.com/wp-content/themes/namtrung/images/customer.png" : cookies.get('data').attributes.img} alt="Admin" />
                                Xin Chào, {cookies.get('data').attributes.name}<i className="fas fa-angle-down"></i></button>
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
                    </>
                )
            } else {
                return (
                    <li className="b-item ">
                        <button className="b-btn" onClick={this.showModal}><i className="fas fa-user"></i> Đăng Nhập</button>
                    </li>
                )

            }
        }
        const contentLogout = () => {
            if (this.state.isLogout) {
                return (
                    <li className="b-item ">
                        <button className="b-btn" onClick={this.showModal}>
                            Đăng Nhập</button>
                    </li>
                )
            } else {
                return (
                    <>
                        {contentLogin()}
                    </>
                )

            }
        }

        return (
            <header className="b-page-header" >
                <Modal
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}>
                    <div className="b-login">
                        <div className="b-heading">
                            <h2 className="b-text-title">
                                Đăng Nhập
                            </h2>
                        </div>
                        <div className="b-content" style={{ width: '100%' }}>
                            <GoogleLogin
                                clientId={API_GG}
                                // scope="https://www.googleapis.com/auth/analytics"
                                onSuccess={this.responseGoogle}
                                onFailure={this.error}
                                // onRequest={loading}
                                // offline={false}
                                // approvalPrompt="force"
                                // responseType="id_token"
                                // isSignedIn
                                theme="dark"
                                className="b-google"
                            />
                        </div>
                    </div>
                </Modal>
                <div className="b-block">
                    <div className="b-block-left">
                        <div className="b-icon">
                            {this.props.isHome !== true ? <Link to={'/'}>
                                <img src={Logo} alt="Logo" />
                            </Link>
                                :
                                <img src={Logo} alt="Logo" />}
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
function mapStateProps(state) {
    return {
        isLogin: state.login.isLogin,
        user: state.login.user
    }
}
export default connect(mapStateProps, null)(HeaderLayout);