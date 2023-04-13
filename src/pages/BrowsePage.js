import PageComponent from '../components/PageComponent';
import BrowseComponent from '../components/BrowseComponent';

function BrowsePage() {
	return (
        <PageComponent>
            <h1 className='mt-5'>Dog Search</h1>
            <div className="mt-3">
                <BrowseComponent/>
            </div>
        </PageComponent>
	);
}

export default BrowsePage;
