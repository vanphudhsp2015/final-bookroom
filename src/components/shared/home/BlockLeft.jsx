import React, {Component} from 'react';

class BlockLeft extends Component {
    render() {
        return (
            <div className="b-block-left">
                <div className="b-group-btn">
                    <button className="b-btn waves-effect waves-light">
                        TẠO
                    </button>
                </div>
                <div className="b-calender">
                    <img src="https://i.stack.imgur.com/2RXcN.gif" alt="Calender"/>
                </div>
                <div className="b-rooms">
                    <div className="b-heading text-center">
                        <h2 className="b-text-title">
                            PHÒNG
                        </h2>
                    </div>
                    <div className="b-form">
                        <form>
                            <div className="b-form-group">
                                <input type="checkbox" name="a"/>
                                <label htmlFor="a">
                                    Phòng họp nhỏ 1
                                </label>
                            </div>
                            <div className="b-form-group">
                                <input type="checkbox" name="a"/>
                                <label htmlFor="a">
                                    Phòng họp nhỏ 1
                                </label>
                            </div>
                            <div className="b-form-group">
                                <input type="checkbox" name="a"/>
                                <label htmlFor="a">
                                    Phòng họp nhỏ 1
                                </label>
                            </div>
                            <div className="b-form-group">
                                <input type="checkbox" name="a"/>
                                <label htmlFor="a">
                                    Phòng họp nhỏ 1
                                </label>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default BlockLeft;