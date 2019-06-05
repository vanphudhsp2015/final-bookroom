import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const env = process.env || {}
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
    }
    onChanger = (event) => {
        var self = this;
        if (event.target.value.trim() === "") {
            this.setState({
                isChanger: false
            })
        } else {
            this.setState({
                isChanger: true
            })
        }
        axios.request({
            method: 'GET',
            url: `${env.REACT_APP_API_BE}/api/v1/search/${event.target.value.trim() === '' ? 's' : event.target.value.trim()}`,
            headers: {
                "Accept": "application/json",
                'Content-Type': 'application/json',
                'Authorization': `${'bearer ' + cookies.get('token')}`
            },
        }).then(function (response) {
            self.setState({
                data: response.data.data
            })

        }).catch(function (error) {

        })
    }
    onAddEmail = (data) => {
        let arrayNew = [];
        let dataObject = { id: this.state.arrayEmail.length > 0 ? this.state.arrayEmail[this.state.arrayEmail.length - 1].id + 1 : 1, email: data.attributes.email };
        arrayNew = [...this.state.arrayEmail, dataObject];
        this.setState({
            arrayEmail: arrayNew,
            isChanger: false,
        })
    }
    _handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            let arrayNew = [];
            let dataObject = {
                id: this.state.arrayEmail.length > 0 ? this.state.arrayEmail[this.state.arrayEmail.length - 1].id + 1 : 1,
                email: event.target.value
            }
            arrayNew = [...this.state.arrayEmail, dataObject];
            this.setState({
                arrayEmail: arrayNew,
                isChanger: false,
            })
        }
    }
    onRemoveEmail = (id) => {
        let data = this.state.arrayEmail.filter(data => data.id !== id);
        this.setState({
            arrayEmail: data
        })
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
                        <input type="text" className="b-input" name='email' autoComplete="off" placeholder="Thêm Khách" onChange={this.onChanger} onKeyPress={this._handleKeyDown} />
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
                            <div className="b-item" key={data.id}>
                                <h2 className="b-text-title">
                                    {data.email}
                                </h2>
                                <button className="b-btn"><i className="fas fa-times" onClick={this.onRemoveEmail.bind(this, data.id)} /></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default SearchComponent;