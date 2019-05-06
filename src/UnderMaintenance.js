import React, { Component } from 'react'

const UnderMaintenance = props => {
    return (
        <div style={ {width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'} }>
            <h1>This site is under maintenance. Please try again later.</h1>
        </div>
    )
};

export default UnderMaintenance;