import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button, Row, Col } from 'react-bootstrap';

import { logout } from '../utility/LoginUtility';

function HeaderComponent(){

    const [redirect, setRedirect] = useState(null);

    const clickLogout = () => {
        logout();
        setRedirect('/');
    }

    if(redirect) {
    	return (
    		<Navigate to={redirect}/>
    	);
    }

	return (
		<div className={'px-md-3 px-lg-5 pt-3 pb-0 pb-md-2 text-muted text-center text-md-start pageHeader bg-info text-white clearfix'}>
			<Row className='container'>
				<Col sm="12" md="6">
                    <h2 className='page-title' >
                        lucky dog!
                    </h2>
				</Col>
                <Col sm="12" md="6">
                    <div className="d-inline">
                        <Button className={"float-end mt-0 mt-md-0 mb-2"} variant="flat" onClick={clickLogout}>Log Out</Button>
                    </div>
                </Col>
			</Row>
		</div>
	);
}

export default HeaderComponent;