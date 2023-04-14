import React, { useState, useEffect, useRef } from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

function TooltipBit(props) {
  const [show, setShow] = useState(false);
  const overlayRef = useRef(null);

  const order = props.order ?? 1;

  useEffect(() => {
    let showTimer, hideTimer;

    showTimer = setTimeout(() => {
      setShow(true);
    }, 4000 * order + 500);

    hideTimer = setTimeout(() => {
      setShow(false);
    }, 4000 * ( order + 1));

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip>{props.tip}</Tooltip>}
      ref={overlayRef}
      trigger={['hover', 'focus']}
      show={show}
    >
      <div className="hover-me">
        {props.children}
      </div>
    </OverlayTrigger>
  );
}

export default TooltipBit;
