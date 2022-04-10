/* eslint-disable jsx-a11y/anchor-is-valid */
import Row from '../components/Row';
import React, {  useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

function Waiting (props) {
    const socket = props.socket;

    const [isWaiting, setIsWaiting] = useState(true);
    const [link, setLink] = useState('/');
    const [updates, setUpdates] = useState('Waiting for player to join...');



    const startSession = (socket) => {       
        setIsWaiting(false)
    }



    const whoIsPlaying = (data) => {
        if(data === localStorage.getItem('name')) {
            setLink('/choose');
        } else {
            setLink('/game');
        };
    };

    const gameIsBusy = () => {
        setUpdates('Someone is already playing...');
    };



    useEffect (() => {
        
        socket.connect();       

        
        socket.emit('updateName', localStorage.getItem('name'));
        
        
        
    });
    socket.on('busy', gameIsBusy);
    
    socket.on('startSession', startSession);
    
    socket.on('whoIsPlaying', whoIsPlaying);

    
        return(
            <div className='mainBlock centered col-12'>
                <Row>
                    <Row>
                        <div className='col-12'>
                                <img src={process.env.PUBLIC_URL + '/images/logo.png'} alt='Draw & Guess'/>
                        </div>
                    </Row>
                    <Row>
                        <div className="col-12 centered"><p>Draw & Guess</p></div>
                    </Row>
                    <Row>
                            <Row>
                                {!isWaiting ?
                                <Link to={link} className='btn'>Enter Game</Link>
                                : <p>{updates}</p>
                                }
                            </Row>

                    </Row>
                </Row>

            </div>
        );
};

export default Waiting;