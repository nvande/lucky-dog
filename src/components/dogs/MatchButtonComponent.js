import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { FaArrowRight } from 'react-icons/fa';
import TooltipBit from '../bits/TooltipBit';
import SpinnerBit from '../bits/SpinnerBit';

const MatchButtonComponent = ({ show, onClick, loading }) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  return (
    <Button
      className={`match-button ${isVisible ? 'show' : ''}`}
      onClick={() => onClick()}
    >
      {isVisible && 
        <TooltipBit tip="Click here when you are ready to find your match from your favorites." order={1}/>
      }
      {loading ? <SpinnerBit/> : <FaArrowRight />}
    </Button>
  );
};

export default MatchButtonComponent;
