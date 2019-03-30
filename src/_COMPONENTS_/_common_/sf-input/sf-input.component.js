import React from 'react';
import './sf-input.scss';
import Wrap from "../wrap/sf-wrap.component";

const Input = (props) => {
    let elem = null;

    switch (props.type) {
        case ('input'):
            elem = <input {...props} />;
            break;
        case ('textarea'):
            elem = <textarea {...props} />;
            break;
        case ('checkbox'):
            elem =  <div style={{display:'inline-block'}}>
                <input className="sf-checkbox" {...props} />
                <label htmlFor={props.id}>{props.label}</label>
            </div>;
            break;
        case ('radio'):
            elem =  <div style={{display:'inline-block'}}>
                <input {...props} />
                <label htmlFor={props.id}>{props.label}</label>
            </div>;
            break;
        default:
            elem = <input {...props} />;
            break;
    }

    return (
        <Wrap>
            { props.type !== 'checkbox' && props.type !== 'radio' && props.label ? <label>{props.label}</label> : null }
            { elem }
        </Wrap>
    )
};

export { Input };