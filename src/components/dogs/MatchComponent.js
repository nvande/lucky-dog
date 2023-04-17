import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaPhone, FaDog, FaArrowLeft, FaHeart, FaArrowDown } from 'react-icons/fa';

function MatchComponent({ matchedDog, city, yourName, clearMatch }) {
  const [showPhone, setShowPhone] = useState(false);

  return (
    <Modal show={matchedDog != null} onHide={clearMatch} dialogClassName="fullscreen-modal">
      <Modal.Header closeButton className='justify-content-center'>
        <Modal.Title className='ms-2'>
            {!showPhone ? <i>It's a match!</i> : 'END'}
        </Modal.Title>
      </Modal.Header>
      {showPhone && 
        <Modal.Body>
            <div className="match-info my-5">
                <p>
                    That's the end of this demo.<br/>
                    I want to thank you for your time to get this far,<br/>
                    and I appreciate your consideration for the postion.
                </p>
                <p className='mt-3'>
                    <b>Nick Vander Woude</b>
                </p>
                <p>
                    t2vanden@gmail.com
                </p>
                <p>
                    <a href = 'https://github.com/nvande'>Github</a>
                </p>
                <p className='mt-3 text-muted fw-light'>
                    <i>
                        “The well-taught philosophic mind <br/>
                        To all compassion gives; <br/>
                        Casts round the world an equal eye, <br/>
                        And feels for all that lives.”
                    </i><br/>
                    <span className='text-center d-block w-100'>
                        - THE MOUSE'S PETITION, <br/>
                        Anna Laetitia Barbauld <br/>
                        (1743-1825)
                    </span>
                </p>
                <h4 className='mt-3'> <FaHeart className='inline-icon me-1'/> Be kind to animals</h4>
                <Button className='mt-3' onClick={() => setShowPhone(false)}><FaArrowLeft/> Return to App</Button>
            </div>
        </Modal.Body>
      }
      {!showPhone &&
        <Modal.Body>
            <div className="match-info">
                <h5 className='mt-4 fst-italic text-muted'>
                    {yourName && <span> {`${yourName.first}, meet`} </span>}
                </h5>
                <h1 className="match-name mt-1 mb-2">
                    {matchedDog && <span>{matchedDog.name}</span>}
                </h1>
                <div className="match-image mb-5 mt-3">
                    {matchedDog && <img src={matchedDog.img} alt={matchedDog.name} /> }
                </div>
                <div className="match-details">
                    {matchedDog && 
                        <>
                            <p className='fs-3'>Age {matchedDog.age}</p>
                            <p>{city}</p>
                            <p className='fs-3'><FaDog className='inline-icon me-2'/><i>{matchedDog.breed}</i></p>
                        </>
                    }
                    <span><i>psst!</i> click here <FaArrowDown/></span>
                    <Button onClick={() => setShowPhone(true)} className="ldbutton mb-3 mt-2"><FaPhone className='inline-icon me-2'/>
                        Contact Shelter
                    </Button>
                    <Button onClick={() => clearMatch()} className="ldbutton mb-4 modal-return"><FaArrowLeft/> Return to search </Button>
                </div>
            </div>
        </Modal.Body>
      }
    </Modal>
  );
};

export default MatchComponent;