import React, { Component } from 'react'

const UnderMaintenance = props => {
    return (
        <div style={ {width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'} }>
            <img style={{width: '350px'}}
                src="https://smoothflowgm.wpengine.com/wp-content/uploads/2018/08/smoothflow-home-We-Bring-The-Pieces-Together_01.svg"
                alt=""/>
            <h1>We're making things more cooler for you!.</h1>
            <h4>We apologise for the inconvenience. Please come back later.</h4>
        </div>
    )
};

export default UnderMaintenance;