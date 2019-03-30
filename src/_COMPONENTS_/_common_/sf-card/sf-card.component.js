import React, { Component } from 'react'
import './sf-card.scss'

const Card = props => {

    return (
        <div className={`sf-card ${props.className}`}>
            { props.children }
        </div>
    )

};

export { Card };