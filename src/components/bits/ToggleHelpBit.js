import React, { useState, useEffect } from 'react';
import { Button } from "react-bootstrap";
import { TbHelp, TbHelpOff } from "react-icons/tb";

function ToggleHelpBit() {
    const [showHelp, setShowHelp] = useState(null);

    useEffect(() => {
        const storedShowHelp = window.localStorage.getItem('showHelp');
        if (storedShowHelp && storedShowHelp !== 'undefined') {
            setShowHelp(JSON.parse(storedShowHelp));
        }
    }, []);

    useEffect(() => {
        if(showHelp !== null) {
            window.localStorage.setItem('showHelp', JSON.stringify(showHelp));
            if (showHelp) {
                document.body.classList.remove('hide-tooltips');
            } else {
                document.body.classList.add('hide-tooltips');
            }
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

