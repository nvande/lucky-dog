function FooterComponent({footer, attributes}){
	return (
		<div className={'text-center mt-5 mb-1 text-muted footer'}>
			<small>{footer}</small><br/>
			<small>{attributes}</small>
		</div>
	);
}

export default FooterComponent;