import React, { Component } from 'react';
import { Link } from 'react-router-dom';
class DashboardComponent extends Component {
    render() {
        return (
            <div className="row">
                <div className="col-lg-5">
                    <div className="page-title">
                        <h3 className="title">Dashboard</h3>
                        <Link to="/" className="b-link">Home</Link>
                        <span className="b-arrow">
                            <i className="fas fa-chevron-right" />
                            &nbsp;Library</span>
                    </div>
                </div>
                <div className="col-lg-7">
                    <div className="btn-upgrade">
                        <Link to="/" className="link-upgrade">Upgrade to pro</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default DashboardComponent;