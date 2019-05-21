import React, { Component } from 'react';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
class ProfileComponent extends Component {
    render() {
        let data = {}
        if (cookies.get('data') !== undefined) {
            data = cookies.get('data')
        }
        console.log(data);

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-4">
                        <div className="b-card">
                            <div className="card-body">
                                <div className="card-user text-center">
                                    <img src={data.attributes.img} className="img-user" alt="profile" />
                                    <h3 className="title-name">{data.attributes.name}</h3>
                                    <h6 className="card-subtitle">{data.attributes.email}</h6>
                                    <div className="link-text">
                                        <a className="link" href="/">254</a>
                                        <a className="link" href="/">54</a>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className="card-body">
                                <small className="text-muted">Email address</small>
                                <h6 className="text">{data.attributes.email}</h6>
                                <small className="text-muted">Phone</small>
                                <h6 className="text">0935489063</h6>
                                <small className="text-muted">Address</small>
                                <h6 className="text">71 Pilgrim Avenue Chevy Chase, MD 20815</h6>
                                <div className="map-box">

                                </div>
                                <small className="text-muted p-t-30 db">Social Profile</small>
                                <br />
                                <button className="btn btn-circle btn-secondary">
                                    <i className="fab fa-facebook-f" />
                                </button>
                                <button className="btn btn-circle btn-secondary">
                                    <i className="fab fa-twitter" />
                                </button>
                                <button className="btn btn-circle btn-secondary">
                                    <i className="fab fa-youtube" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <div className="b-card">
                            <div className="card-body">
                                <form className="form-horizontal form-material">
                                    <div className="form-group">
                                        <label className="text-contact">Full Name</label>
                                        <input className="form-control" placeholder="Johnathan Doe" type="text" /></div>
                                    <div className="form-group">
                                        <label className="text-contact">Email</label>
                                        <input className="form-control" placeholder="johnathan@admin.com" type="text" /></div>
                                    <div className="form-group">
                                        <label className="text-contact">Password</label>
                                        <input className="form-control" defaultValue="password" type="password" /></div>
                                    <div className="form-group">
                                        <label className="text-contact">Phone No</label>
                                        <input className="form-control" placeholder="123 456 7890" type="text" /></div>
                                    <div className="form-group">
                                        <label className="text-contact">Message</label>
                                        <textarea className="form-control" rows={5} defaultValue={""} />
                                    </div>
                                    <div className="form-group">
                                        <label className="text-contact">Select Country</label>
                                        <select className="form-control">
                                            <option className="city">London</option>
                                            <option className="city">India</option>
                                            <option className="city">Vietnam</option>
                                            <option className="city">Thailan</option>
                                            <option className="city">Singapore</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <button className="btn btn-success">Update Profile</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProfileComponent;