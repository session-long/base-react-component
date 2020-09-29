import React from 'react';
import { Button } from 'antd';
import './index.scss';

class AuthCodeButton extends React.Component {

    lintener = null;

    state = {
        times: 0
    }

    render() {
        return (
            <Button disabled={this.state.times <= 0 ? false : true} type='text' onClick={() => {
                if (this.state.times === 0) {
                    let flag = true;
                    if (this.props.onClick) {
                        flag = this.props.onClick();
                    }
                    if(!flag) return;

                    this.state.times = 60;
                    this.lintener = setInterval(() => {
                        if (this.state.times <= 0 && this.lintener) {
                            this.state.times = 0;
                            clearInterval(this.lintener);
                        } else {
                            this.state.times = this.state.times - 1;
                        }
                        this.setState({});
                    }, 1000);
                    this.setState({});
                }
            }}>
                {
                    this.state.times <= 0 ? '获取验证码' : `${this.state.times}s后获取`
                }
            </Button>
        )
    }

}

export default AuthCodeButton;