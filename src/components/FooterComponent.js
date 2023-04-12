function FooterComponent({footer, attributes}){
	return (
		<div className={'text-center text-muted footer'}>
			<small>{footer}</small><br/>
			<small>{attributes}</small>
		</div>
	);
}

export default FooterComponent;