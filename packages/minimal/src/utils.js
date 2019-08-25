const scrollTo = (x, y) => {
	if (navigator.userAgent.search('jsdom') < 0)
	{
		window.scrollTo(x, y);
	}
};

export { scrollTo };
