import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Alert } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';

import { login } from '../utility/LoginUtility.js';

import constraints from '../validate/validate.js';
import Cookies from 'universal-cookie';

import SpinnerBit from './bits/SpinnerBit.js';

export default function LoginComponent() {
    const validate = require("validate.js");
	const cookies = new Cookies();

	const [name, setName] = useState({
		first: '',
		middle: '',
		last: ''
	});
	const [email, setEmail] = useState('');
	const [error, setError] = useState(false);
	const [errors, setErrors] = useState([]);
	const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
	const [redirect, setRedirect] = useState(null);

	useEffect(() => {
		if(cookies.get('user')) {
			setRedirect('/browse');
		}
	}, []);

    const validateFields = () => {
    	let errors = validate({
    		first_name: name.first,
    		middle_initial: name.middle,
    		last_name: name.last,
	        email_address:email,
    	}, constraints);
    	if(errors && errors.length != 0){
    		setErrors(errors);
    		setError("Please fix the following issues before resubmitting: "+validationToString(errors));
    		return false;
    	} else {
    		setErrors([]);
    	}
    	return true;
    }

    function validationToString (obj) {
	    let str = '';
	    for (const [p, val] of Object.entries(obj)) {
	        str += ` ${val.join('. ')}. \n`;
	    }
	    return str;
	}

	const changeHandler = (e, funct) =>{
		const {name, value} = e.target;
        funct(prev => ({...prev, [name]: value}));
    };

    const postLogin = async () => {
        setLoading(true);

        if(!validateFields()){
            setLoading(false);
    		return;
    	}

        try {
            await login( name, email ).then((success) => {
                if(success) {
					cookies.set('name', name, { path: '/' });
					cookies.set('user', email, { path: '/' });
                    setRedirect('/browse');
                }
            });
        } catch (error) {
            console.log(error);
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    if(redirect) {
    	return (
    		<Navigate to={redirect}/>
    	);
    }

	return (
		<div>
			<Form>
                <hr className='mb-5 mt-5 mx-3'/>
                <h3 className='text-start mx-3'>Your basic info:</h3>
                { error && 
                    <Alert variant="danger" onClose={() => setError(false)} dismissible>
                        <Alert.Heading>Unable to log you in.</Alert.Heading>
                        <p>
                            {error.toString()}
                        </p>
                    </Alert>
                }
                { success && 
                    <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
                        <Alert.Heading>Successfully logged in!</Alert.Heading>
                    </Alert>
                }
			 	<Container className="my-3">
					<Row>
						<Col xs={8} sm={8} lg={5} className={"mb-2 mb-md-4"}>
							<Form.Group controlId="formFirstName">
								<Form.Label>First name</Form.Label>
                                <Form.Control
							    	value={name.first}
							    	name="first"
							    	onChange={(e) => changeHandler(e,setName)}
							    	required
							    	type="text"
                                    disabled={loading}
							    	isInvalid={errors.first_name}
							    />
							    <Form.Control.Feedback type="invalid">
			                		{errors.first_name && errors.first_name.join(", ")}
			              		</Form.Control.Feedback>
							</Form.Group>
						</Col>
				    	<Col xs={4} lg={2} className={"mb-2 mb-md-4"}>
				    		<Form.Group controlId="formMiddleName">
				    			<Form.Label>Middle initial</Form.Label>
                                <Form.Control
							    	value={name.middle}
							    	name="middle"
							    	onChange={(e) => changeHandler(e,setName)}
							    	type="text"
							    	placeholder="(optional)"
                                    disabled={loading}
							    	isInvalid={errors.middle_initial}
							    />
							    <Form.Control.Feedback type="invalid">
			                		{errors.middle_initial && errors.middle_initial.join(", ")}
			              		</Form.Control.Feedback>
							</Form.Group>
				    	</Col>
				    	<Col sm={12} lg={5} className={"mb-2 mb-md-4"}>
				    		<Form.Group controlId="formLastName">
				    			<Form.Label>Last name</Form.Label>
                                <Form.Control
							    	value={name.last}
							    	name="last"
							    	onChange={(e) => changeHandler(e,setName)}
							    	required
							    	type="text"
                                    disabled={loading}
							    	isInvalid={errors.last_name}
						    	/>
						    	<Form.Control.Feedback type="invalid">
			                		{errors.last_name && errors.last_name.join(", ")}
			              		</Form.Control.Feedback>
							</Form.Group>
				    	</Col>
					</Row>
					<Row>
						<Col xs={12} className={"mb-2 mb-md-4"}>
							<Form.Group controlId="formEmail">
								<Form.Label>Email</Form.Label>
								<Form.Control
									value={email}
									onChange={(event) => {setEmail(event.target.value);}}
									required
									type="text"
                                    disabled={loading}
									isInvalid={errors.email_address}
								/>
								<Form.Control.Feedback type="invalid">
			                		{errors.email_address && errors.email_address.join(", ")}
			              		</Form.Control.Feedback>
							</Form.Group>
						</Col>
					</Row>
                    <div className={'text-center mt-4'}>
                        <Button className={'px-5 ldbutton'} onClick={postLogin}>
                            { loading ? <SpinnerBit/> : "View Dogs" }
                        </Button>
                    </div>
                </Container>
			</Form>
		</div>
	);
}