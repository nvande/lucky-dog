import PageComponent from '../components/PageComponent';
import BrowseComponent from '../components/BrowseComponent';
import ToggleHelpBit from '../components/bits/ToggleHelpBit';

function BrowsePage() {
    const byLine = Math.floor(Math.random() * 11);
	return (
        <PageComponent>
            <ToggleHelpBit/>
            <h1 className='mt-3 mt-md-5'>Dog Search</h1>
            { byLine === 0 && <h5> You are <b>so close</b> to helping a shelter dog find a new home! </h5> }
            { byLine === 1 && <h5> Dog adoption is a <b>win-win</b> for you and the dog. </h5> }
            { byLine === 2 && <h5> No dog deserves to be homeless. You can be their fresh start. </h5> }
            { byLine === 3 && <h5> Rescuing a dog makes a difference in their life and yours. </h5> }
            { byLine === 4 && <h5> <i>“Secondhand animals make first class pets.”</i> – Unknown </h5> }
            { byLine === 5 && <h5> <i>“Who rescued who?”</i> – Unknown </h5> }
            { byLine === 6 && <h5> <i>“Adopt, don't shop.”</i> – Unknown </h5> }
            { byLine === 7 && <h5> <i>“Love is a four-legged word.”</i> – Unknown </h5> }
            { byLine === 8 && <h5> <i>“The best things in life are rescued.”</i> – Unknown </h5> }
            { byLine === 9 && <h5> <i>“Rescued is my favorite breed.”</i> – Unknown </h5> }
            { byLine === 10 && <h5> <i>“You can't buy love, but you can rescue it.”</i> – Unknown </h5> }
            <div className="mt-md-3">
                <BrowseComponent/>
            </div>
        </PageComponent>
	);
}

export default BrowsePage;
