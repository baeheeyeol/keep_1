function validateEmail(email) {
	// 공백·@문자 제외된 문자열 + '@' + 공백·@문자 제외된 문자열 + '.' + 공백·@문자 제외된 문자열
	const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return re.test(email);
}