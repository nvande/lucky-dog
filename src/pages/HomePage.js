import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import PageComponent from '../components/PageComponent';

function HomePage() {
	return (
        <PageComponent>
            <div className="mt-5">
                <h1>
                    Your new best friend may be waiting...
                </h1>
                <Link to="login">
                    <Button variant="flat" className='mt-5 mb-2'> Find your Lucky Dog </Button>
                </Link>
            </div>
        </PageComponent>
	);
}

export default HomePage;