/* eslint-disable jsx-a11y/anchor-is-valid */
import Row from '../components/Row';
import React, { useEffect, useState } from 'react';
import Emptycol from '../components/Emptycol';
import { Link } from 'react-router-dom';


function Choose (props) {

    const socket = props.socket;

    // const diff = useParams().diff;
    const [diff, setDiff] = useState('easy');
    const [isLoading, setIsLoading] = useState(true);
    const [wordlist, setWordList] = useState([]);
    const [isActive, setIsActive] = useState('easy');
    const [isActiveWord, setIsActiveWord] = useState();    
    
    async function fetchApi ()  { 
        const response = await fetch('http://localhost:3001/api/words/' + diff);
        await response.json()
        .then(response => {
            return response.words;
        })
        .then(data =>  {
            setWordList(data);
            setIsActiveWord(data[0]);
            setIsLoading(false);    
        });

    };
    
    useEffect(() => {
        fetchApi();
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
        
    
    const difficultyHandler = (e) => {
        setDiff(e.target.id);
        setIsActive(e.target.id);
        socket.emit('updateDiff', e.target.id);
        fetchApi();
    };

    const wordHandler = (e) => {
        setIsActiveWord(e.target.id);
        socket.emit('updateWord', e.target.id);
    };



            
                return (
                    <div className='mainBlock centered col-12'>
                        <Row>
                            <Row>
                                <div className='centered col-12'>
                                    <p>Choose level:</p>
                                    <a className={`btn ${isActive === 'easy' && 'active'}`} id='easy' value='easy' onClick={(e) => difficultyHandler(e)}>Easy</a>
                                    <a className={`btn ${isActive === 'medium' && 'active'}`} id='medium' value='medium' onClick={(e) => difficultyHandler(e)}>Medium</a>
                                    <a className={`btn ${isActive === 'hard' && 'active'}`} id='hard' value='hard' onClick={(e) => difficultyHandler(e)}>Hard</a>
                                </div>
                            </Row>

                            {!isLoading ? 
                            <React.Fragment>
                            <Row>
                                <div className='centered col-12'>
                                    <p>Choose Word:</p>
                                    <a className={`btn words ${isActiveWord === wordlist[0] && 'active'}`} id={wordlist[0]} onClick={(e) => wordHandler(e)}>{wordlist[0]}</a>
                                    <a className={`btn words ${isActiveWord === wordlist[1] && 'active'}`} id={wordlist[1]} onClick={(e) => wordHandler(e)}>{wordlist[1]}</a>
                                    <a className={`btn words ${isActiveWord === wordlist[2] && 'active'}`} id={wordlist[2]} onClick={(e) => wordHandler(e)}>{wordlist[2]}</a>
                                </div>
                            </Row>
                            </React.Fragment> : 
                            <React.Fragment>
                                <p>Loading words...</p>
                            </React.Fragment>}
                            <Row>
                                <Row>
                                    <Emptycol cols={12}/>
                                </Row>
                                <div className='col-12'>
                                        <Link to='/game' className='btn'>Continue</Link>
                                </div>
                            </Row>
                        </Row>
                    </div>
                );

    
};

export default Choose;