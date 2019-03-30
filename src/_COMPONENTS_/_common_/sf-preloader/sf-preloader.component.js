import React, { Component } from 'react';
import './sf-preloader.scss';

const Preloader = (props) => {
    return (
        <div className={`sf-preloader ${props.type === 'PRIMARY' ? '-primary' : ''}`}>
            <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
        </div>
    )
}

export { Preloader }