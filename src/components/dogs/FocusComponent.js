import { Modal, Button } from 'react-bootstrap';
import { FaDog, FaArrowLeft } from 'react-icons/fa';

function FocusComponent({ focusedDog, city, clearFocus }) {

  return (
    <Modal show={focusedDog != null} onHide={clearFocus} dialogClassName="fullscreen-modal">
        <Modal.Body>
            <div className="focus-info">
                <h1 className="focus-name mt-4 mb-1">
                    {focusedDog && <span>{focusedDog.name}</span>}
                </h1>
                <div className="focus-image">
                    {focusedDog && <img src={focusedDog.img} alt={focusedDog.name} /> }
                </div>
                <div className="focus-details">
                    {focusedDog && 
                        <>
                            <p className='fs-5'>Age {focusedDog.age}</p>
                            <p>{city}</p>
                            <p className='fs-5'><FaDog className='inline-icon me-2'/><i>{focusedDog.breed}</i></p>
                        </>
                    }
                    <Button onClick={() => clearFocus()} className="ldbutton mb-4 modal-return"><FaArrowLeft/> Return to search </Button>
                </div>
            </div>
        </Modal.Body>
    </Modal>
  );
};

export default FocusComponent;