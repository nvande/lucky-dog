import LoginComponent from '../components/LoginComponent.js'
import PageComponent from '../components/PageComponent.js';

import DoggoBit from '../components/bits/DoggoBit.js';

import { Container, Row, Col } from 'react-bootstrap';

function LoginPage() {
	return (
        <PageComponent>
            <div className="mt-5">
                <Container>
                    <Row>
                        <Col xs={8}>
                        <h1 className='text-start'>
                            We are so happy you are chosing to adopt!
                        </h1>
                        <h4 className='text-start'>
                            First, we just need a few pieces of basic information so we can make sure we can connect you to your <u>top dog.</u>
                        </h4>
                        </Col>
                        <Col xs={4}>
                            <DoggoBit/>
                        </Col>
                    </Row>
                </Container>
                <LoginComponent/>
            </div>
        </PageComponent>
	);
}

export default LoginPage;