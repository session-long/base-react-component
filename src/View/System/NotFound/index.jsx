import Style from './index.module.scss';
import React from 'react';

export default class NotFound extends React.Component {

    render() {
        return (
            <div className={Style.Container}>
                404
            </div>
        )
    }

}