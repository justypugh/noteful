import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Note.css';

export default function Note(props) {
    return (
        <div className='Note'>
            <h2 className='Note__title'>
                <Link to={`/note/${props.id}`}>
                    {props.name}
                </Link>
            </h2>
            <button className='Note__delete' type='button'>
            <FontAwesomeIcon icon='trash-alt' />
            {' '}
            Remove
            </button>
            <div className='Note__dates'>
                <div className='Note__dates-modified'>
                    Modified
                    {' '}
                    <span className='Date'>
                        {new Date(props.modified).toLocaleDateString()} &nbsp;
                        {new Date(props.modified).toLocaleTimeString()}
                    </span>
                </div>
            </div>
        </div>
    )
}