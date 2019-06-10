import React, { Component } from 'react';
import { http } from '../../../../libraries/http/http';
class SearchComponent extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            data: [],
            arrayEmail: [],
            email: ''
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.arrayEmail !== prevState.arrayEmail) {
            this.props.onGetArrayEmail(this.state.arrayEmail);
        }
        if (this.state.email !== prevState.email) {
            if (this.state.email.trim() === '') {
                this.setState({
                    isChanger: false
                })
            }
        }
    }
    onChanger = (event) => {
        var timeout = null;
        clearTimeout(timeout);
        var self = this;
        this.setState({
            [event.target.name]: event.target.value
        })
        if (this.state.email === '') {
            self.setState({
                isChanger: false,
            })
        } else {
            self.setState({
                isChanger: true
            })
        }
        var value = event.target.value.trim();
        timeout = setTimeout(function () {
            http.request({
                method: 'GET',
                url: `/search/${value === '' ? 's' : value}`,
            }).then(function (response) {
                self.setState({
                    data: response
                })
            }).catch(function (error) {

            })
        }, 700);

    }
    onAddEmail = (data) => {
        let arrayNew = [];
        let dataObject = { id: this.state.arrayEmail.length > 0 ? this.state.arrayEmail[this.state.arrayEmail.length - 1].id + 1 : 1, email: data.attributes.email };
        arrayNew = [...this.state.arrayEmail, dataObject];
        const newArrray = Array.from(new Set(arrayNew.map(s => s.email))).map(email => {
            return {
                email: arrayNew.find(s => s.email === email).email
            }
        })
        this.setState({
            arrayEmail: newArrray,
            isChanger: false,
            email: ''
        })
        this.props.onGetArrayEmail(this.state.arrayEmail);
    }
    _handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            let arrayNew = [];
            let dataObject = {
                id: this.state.arrayEmail.length > 0 ? this.state.arrayEmail[this.state.arrayEmail.length - 1].id + 1 : 1,
                email: event.target.value
            }
            arrayNew = [...this.state.arrayEmail, dataObject];
            const newArrray = Array.from(new Set(arrayNew.map(s => s.email))).map(email => {
                return {
                    email: arrayNew.find(s => s.email === email).email
                }
            })

            this.setState({
                arrayEmail: newArrray,
                isChanger: false,
                email: ''
            })
            this.props.onGetArrayEmail(this.state.arrayEmail);
        }
    }
    onRemoveEmail = (item) => {
        let data = this.state.arrayEmail.filter(data => data.email !== item);
        this.setState({
            arrayEmail: data
        })
        this.props.onGetArrayEmail(this.state.arrayEmail);
    }
    render() {
        return (
            <div className="b-description-right">
                <div className="b-heading">
                    <h2 className="b-text-title">
                        Thành Phần Tham Dự
                    </h2>
                </div>
                <div className="b-description-content">
                    <div className="b-form-group">
                        <input type="text" className="b-input" value={this.state.email} name='email' autoComplete="off" placeholder="Thêm Khách" onChange={this.onChanger} onKeyPress={this._handleKeyDown} />
                        <div className={this.state.isChanger ? "b-list-user  is-active" : "b-list-user"}>
                            {this.state.data.map(data => (
                                <div className="b-item" key={data.id} onClick={this.onAddEmail.bind(this, data)}>
                                    <h2 className="b-text-name">
                                        {data.attributes.name}
                                    </h2>
                                    <p className="b-text-norm">
                                        {data.attributes.email}
                                    </p>
                                </div>
                            ))}

                        </div>
                    </div>
                    <div className="b-list-item">
                        {this.state.arrayEmail.map(data => (
                            <div className="b-item" key={data.email}>
                                <h2 className="b-text-title">
                                    {data.email}
                                </h2>
                                <button className="b-btn"><i className="fas fa-times" onClick={this.onRemoveEmail.bind(this, data.email)} /></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default SearchComponent;