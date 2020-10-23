import Style from './index.module.scss';
import React from 'react';
import Map from '../../Component/Map';

class Index extends React.Component {
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
