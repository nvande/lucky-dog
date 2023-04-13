import { Card, Button } from 'react-bootstrap';
import SpinnerBit from '../bits/SpinnerBit';

import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { TfiHandDrag } from 'react-icons/tfi';


function DogComponent({ dogObject, city, size, addFunc, removeFunc }) {
  const isLarge = size === 'large';

    if(isLarge) {
        return (
            <Card className='mb-4'>
                <Card.Body>
                    <div className='dog-img-placeholder' />
                    <Card.Img  src={dogObject.img} />
                    <Card.ImgOverlay>
                        {city ? 
                            <Card.Text>{city}</Card.Text>
                            :
                            <>
                                <Card.Text>{dogObject.zip_code}<SpinnerBit className="text-white ms-1"/></Card.Text>
                            </>
                        }
                    </Card.ImgOverlay>
                    <Card.Title>
                        {dogObject.name}
                        <Button className='drag-icon'> <TfiHandDrag/> </Button>
                        <Button onClick={addFunc} className='take-icon'><FaArrowRight/></Button>
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Age {dogObject.age}</Card.Subtitle>
                    <Card.Text className='text-muted fs-italic' >{dogObject.breed}</Card.Text>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card className='mb-2 side-card'>
            <div className="side-img-wrap">
                <Card.Img variant='top' src={dogObject.img} />
                <div className="side-info">
                    {city ? 
                        <Card.Text>{city}</Card.Text>
                        :
                        <>
                            <Card.Text>{dogObject.zip_code}<SpinnerBit className="text-white ms-1"/></Card.Text>
                        </>
                    }
                    <Card.Title className='side-title'>{dogObject.name}</Card.Title>
                    <Card.Subtitle className='mb-2 side-subtitle'>
                        Age {dogObject.age}
                    </Card.Subtitle>
                    <Card.Text className='fs-italic side-text' >{dogObject.breed}</Card.Text>
                </div>
            </div>
            <Button onClick={removeFunc} className='take-icon'><FaArrowLeft/></Button>
            <Button className='drag-icon'> <TfiHandDrag/> </Button>
        </Card>
    );
}

export default DogComponent;
