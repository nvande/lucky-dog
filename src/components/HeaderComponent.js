import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button, Row, Col, Badge, Tooltip, OverlayTrigger } from 'react-bootstrap';

import { logout } from '../utility/LoginUtility';
import Cookies from 'universal-cookie';

import LogoBit from './bits/LogoBit';
import { FaSignOutAlt, FaUser } from 'react-icons/fa';

function HeaderComponent(){

    const [redirect, setRedirect] = useState(null);
    const cookies = new Cookies();

    const user = cookies.get('user');

    const clickLogout = () => {
        cookies.remove('name');
        cookies.remove('user');
        logout();
        setRedirect('/');
    }

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" className="d-md-none" {...props}>
          {user}
        </Tooltip>
      );

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
                {user && 
                    <Col xs="6">
                        <div className="d-inline">
                            <Button className={"ldbutton logout-button float-end mt-0 mt-md-0 mb-2"} onClick={clickLogout}>
                                <FaSignOutAlt className='me-1' /><span>Log Out</span>
                            </Button>
                            <OverlayTrigger
                                placement="bottom"
                                delay={{ show: 250, hide: 400 }}
                                overlay={renderTooltip}
                            >
                                <Badge className='username float-end me-1 mb-2 fs-6'>
                                    <FaUser className='inline-icon me-1'/><span>{user}</span>
                                </Badge>
                            </OverlayTrigger>
                            
                        </div>
                    </Col>
                }
			</Row>
		</div>
	);
}

export default HeaderComponent;