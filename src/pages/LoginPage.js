import LoginComponent from '../components/LoginComponent.js'
import PageComponent from '../components/PageComponent.js';

function LoginPage() {
	return (
        <PageComponent>
            <div className="mt-5">
                <h1 className='mx-5'>
                    We are so happy you are chosing to adopt!
                </h1>
                <h4 className='mx-5'>
                    First, we just need a few pieces of basic information so we can make sure we can connect you to your <u>top dog.</u>
                </h4>
                <LoginComponent/>
            </div>
        </PageComponent>
	);
}

export default LoginPage;