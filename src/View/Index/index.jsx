import Style from './index.module.scss';
import React from 'react';
import Map from '../../Component/Map';
import API from '../../API';

class Index extends React.Component {
    componentDidMount() {
        API.get('http://localhost:8080')
            .commit()
            .then((res) => console.log('xxx', res));
    }

    render() {
        return (
            <div className={Style.Component}>
                欢迎页
                <div className={Style.Map}>
                    <Map />
                </div>
            </div>
        );
    }
}

export default Index;
