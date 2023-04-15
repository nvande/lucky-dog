import PageComponent from '../components/PageComponent';
import BrowseComponent from '../components/BrowseComponent';
import ToggleHelpBit from '../components/bits/ToggleHelpBit';

function BrowsePage() {
    const byLine = Math.floor(Math.random() * 11);
	return (
        <PageComponent>
            <ToggleHelpBit/>
            <h1 className='mt-3 mt-md-5'>Dog Search</h1>
            <h6 className='text-muted fw-light'>
                { byLine === 0 && <span> You are <b>so close</b> to helping a shelter dog find a new home! </span> }
                { byLine === 1 && <span> Dog adoption is a <b>win-win</b> for you and the dog. </span> }
                { byLine === 2 && <span> No dog deserves to be homeless. You can be their fresh start. </span> }
                { byLine === 3 && <span> Rescuing a dog makes a difference in their life and yours. </span> }
                { byLine === 4 && <span> <i>“Secondhand animals make first class pets.”</i> – Unknown </span> }
                { byLine === 5 && <span> <i>“Who rescued who?”</i> – Unknown </span> }
                { byLine === 6 && <span> <i>“Adopt, don't shop.”</i> – Unknown </span> }
                { byLine === 7 && <span> <i>“Love is a four-legged word.”</i> – Unknown </span> }
                { byLine === 8 && <span> <i>“The best things in life are rescued.”</i> – Unknown </span> }
                { byLine === 9 && <span> <i>“Rescued is my favorite breed.”</i> – Unknown </span> }
                { byLine === 10 && <span> <i>“You can't buy love, but you can rescue it.”</i> – Unknown </span> }
            </h6>
            <div className="mt-md-3">
                <BrowseComponent/>
            </div>
        </PageComponent>
	);
}

export default BrowsePage;
