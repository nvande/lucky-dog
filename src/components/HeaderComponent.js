import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button, Row, Col } from 'react-bootstrap';

import { logout } from '../utility/LoginUtility';
import LogoBit from './bits/LogoBit';
import { FaSignOutAlt } from 'react-icons/fa';

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
		<div className={'px-md-1 px-lg-2 pt-2 pb-0 pb-md-2 text-muted sticky-top text-md-start pageHeader text-white clearfix'}>
			<Row className='container header-container'>
				<Col xs="6">
                    <Link to="/" className='page-title-link'>
                        <LogoBit/>
                    </Link>
				</Col>
                <Col xs="6">
                    <div className="d-inline">
                        <Button className={"ldbutton logout-button float-end mt-0 mt-md-0 mb-2"} onClick={clickLogout}>
                            <FaSignOutAlt className='me-1' /><span>Log Out</span>
                        </Button>
                    </div>
                </Col>
			</Row>
		</div>
	);
}

export default HeaderComponent;