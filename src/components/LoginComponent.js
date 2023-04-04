import { useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { FaUser } from 'react-icons/fa';

function handleChange() {

}

export default function LoginComponent() {

	const [name, setName] = useState({
		first: '',
		middle: '',
		last: ''
	});
	const [email, setEmail] = useState('');

	const [errors, setErrors] = useState('');

	const [values, setValues] = useState({});

	const changeHandler = (e, funct) =>{
		const {name, value} = e.target;
        funct(prev => ({...prev, [name]: value}));
    };

	return (
		<div>
			<Form>
                <hr className='mb-5 mt-5 mx-3'/>
                <h3 className='text-start mx-3'>Your basic info:</h3>
			 	<Container className="my-3">
					<Row>
						<Col xs={8} sm={8} lg={5} className={"mb-2 mb-md-4"}>
							<Form.Group controlId="formFirstName">
								<Form.Label>First name</Form.Label>
							    <Form.Control value={name.first} name="first" onChange={(e) => changeHandler(e,setName)} required type="text" />
							</Form.Group>
						</Col>
				    	<Col xs={4} lg={2} className={"mb-2 mb-md-4"}>
				    		<Form.Group controlId="formMiddleName">
				    			<Form.Label>Middle initial</Form.Label>
							    <Form.Control value={name.middle} name="middle" onChange={(e) => changeHandler(e,setName)} type="text" placeholder="(optional)" />
							</Form.Group>
				    	</Col>
				    	<Col sm={12} lg={5} className={"mb-2 mb-md-4"}>
				    		<Form.Group controlId="formLastName">
				    			<Form.Label>Last name</Form.Label>
							    <Form.Control value={name.last} name="last" onChange={(e) => changeHandler(e,setName)} required type="text" />
							</Form.Group>
				    	</Col>
					</Row>
					<Row>
						<Col xs={12} className={"mb-2 mb-md-4"}>
							<Form.Group controlId="formEmail">
								<Form.Label>Email</Form.Label>
								<Form.Control value={email} onChange={(event) => {setEmail(event.target.value);}} required type="text" />
							</Form.Group>
						</Col>
					</Row>
                    <div className={'text-center mt-4'}>
                        <Button className={'px-5'} variant="flat" type="submit">
                            Let's go!
                        </Button>
                    </div>
                </Container>
			</Form>
		</div>
	);
}