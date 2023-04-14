import { Link } from 'react-router-dom';
import DoggoBit from '../components/bits/DoggoBit.js';
import { Button, Container, Row, Col } from 'react-bootstrap';
import PageComponent from '../components/PageComponent';

function HomePage() {
	return (
        <PageComponent>
            <div className="mt-5">
                <Container>
                    <Row>
                        <Col xs={12} md={8}>
                            <div className="d-md-none w-50 float-end small-home-doggo">
                                <DoggoBit/>
                            </div>
                            <h1 className='mx-5 main-text standout-text'>
                                Your newest, <b>bestest</b> friend may already be waiting for you!
                            </h1>
                            <h3 className='standout-text fw-light'>
                                Adoption not only gives a deserving animal a loving home,
                                it also combats pet overpopulation and promotes a more humane society.
                            </h3>
                            <h2 className='impact-text mx-5 mt-4 mt-sm-5 fw-bold'>
                                Save a life. Adopt a dog.
                            </h2>
                            <Link to="login">
                                <Button className='mt-2 mt-sm-3 mt-md-5 mb-1 mb-md-2 ldbutton'> Find your Lucky Dog </Button>
                            </Link>
                        </Col>
                        <Col xs={12} md={4}>
                            <div className="d-none d-md-block doggo-col">
                                <DoggoBit isHomepage={true}/>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </PageComponent>
	);
}

export default HomePage;