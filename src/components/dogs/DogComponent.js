import { Card } from 'react-bootstrap';
import SpinnerBit from '../bits/SpinnerBit';

function DogComponent({ dogObject, city, size }) {
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
                            <SpinnerBit className="text-white"/>
                        }
                    </Card.ImgOverlay>
                    <Card.Title>{dogObject.name}</Card.Title>
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
            <Card.Text className='side-header'>{city}</Card.Text>
            <Card.Title className='side-title'>{dogObject.name}</Card.Title>
            <Card.Subtitle className='mb-2 side-subtitle'>
                Age {dogObject.age}
            </Card.Subtitle>
            <Card.Text className='fs-italic side-text' >{dogObject.breed}</Card.Text>
            </div>
        </div>
        </Card>
    );
}

export default DogComponent;
