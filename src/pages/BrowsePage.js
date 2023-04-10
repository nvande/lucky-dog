import PageComponent from '../components/PageComponent';
import BrowseComponent from '../components/BrowseComponent';

function BrowsePage() {
	return (
        <PageComponent>
            <div className="mt-5">
                <BrowseComponent/>
            </div>
        </PageComponent>
	);
}

export default BrowsePage;
