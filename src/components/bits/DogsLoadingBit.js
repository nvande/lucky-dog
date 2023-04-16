import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

function DogsLoadingBit() {
  return (
    <Row className="justify-content-center">
      {Array.from({ length: process.env.REACT_APP_PAGE_SIZE }).map((_, idx) => (
        <Col key={idx} xs={12} sm={6} md={4} lg={3}>
          <Card className='loading-card mb-4'>
            <Card.Body/>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default DogsLoadingBit;
