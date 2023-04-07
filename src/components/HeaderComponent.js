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
			<Row>
				<Col sm="12" md="6">
                    Lucky Dog!
				</Col>
                <Col sm="12" md="6">
                    <div className="d-inline">
                        <Button className={"float-end mt-0 mt-md-0 mb-2"} variant="flat" onClick={clickLogout}>Log Out</Button>
                        <img src={''} className="float-start float-md-end rounded-circle img-thumbnail mt-0 mt-md-0 me-2 me-md-4 userPhoto"/>
                        <span className="float-start float-md-end mt-2 me-2 h6 h-100 align-middle text-white">Username</span>
                    </div>
                </Col>
			</Row>
		</div>
	);
}

export default HeaderComponent;