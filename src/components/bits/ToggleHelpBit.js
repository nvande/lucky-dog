import React, { useState, useEffect } from 'react';
import { Button } from "react-bootstrap";
import { TbHelp, TbHelpOff } from "react-icons/tb";
import Cookies from 'universal-cookie';

function ToggleHelpBit() {
    const cookies = new Cookies();
    let helpCookie = false;

    const [showHelp, setShowHelp] = useState(helpCookie);

    useEffect(() => {
        helpCookie = cookies.get('showHelp');
        setShowHelp(helpCookie);
	}, []);

    useEffect(() => {
		cookies.set('showHelp', showHelp, {path: '/'});    

        if(showHelp) {
            document.body.classList.remove('hide-tooltips');
        } else {
            document.body.classList.add('hide-tooltips');
        }
	}, [showHelp]);

    const toggleHelp = () => {
        setShowHelp(!showHelp);
	}

    return (
        <Button className="show-help" onClick={toggleHelp}>
            {showHelp ? <TbHelpOff/> : <TbHelp/>}
        </Button>
    );
}

export default ToggleHelpBit;