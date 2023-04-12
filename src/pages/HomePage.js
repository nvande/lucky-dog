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
                        <h1 className='mx-5 main-text standout-text'>
                            Your newest, <b>bestest</b> friend may already be waiting!
                        </h1>
                        <h3 className='standout-text fw-light'>
                            Adoption not only gives a deserving animal a loving home,
                            it also combats pet overpopulation and promotes a more humane society.
                        </h3>
                        <h2 className='mx-5 mt-5 fw-bold'>
                            Save a life, adopt a dog.
                        </h2>
                        <Link to="login">
                            <Button className='mt-5 mb-2 ldbutton'> Find your Lucky Dog </Button>
                        </Link>
                        </Col>
                        <Col xs={4}>
                            <DoggoBit isHomepage={true}/>
                        </Col>
                    </Row>
                </Container>
            </div>
        </PageComponent>
	);
}

export default HomePage;