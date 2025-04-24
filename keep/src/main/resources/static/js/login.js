document.addEventListener('DOMContentLoaded', () => {
  const container         = document.getElementById('container');
  const signUpBtnPanel    = document.getElementById('signUpBtn');
  const signInBtnPanel    = document.getElementById('signInBtn');
  const forgotPwdBtn      = document.getElementById('forgotPwdBtn');

  // panels 전환
  signUpBtnPanel.addEventListener('click', () => {
    container.classList.add('sign-up-mode');
  });
  signInBtnPanel.addEventListener('click', () => {
    container.classList.remove('sign-up-mode');
  });
  forgotPwdBtn.addEventListener('click', () => {
    showToast('비밀번호 찾기 페이지로 이동하세요.', 2000);
  });

  // 이메일 중복 확인
  const checkBtn      = document.getElementById('checkEmailBtn');
  const emailInput    = document.getElementById('signup-email');
  const feedback      = document.getElementById('emailFeedback');
  const signupBtn     = document.getElementById('submitSignupBtn');
  const signupForm    = document.getElementById('signup');
  const loginEmail    = document.querySelector('.sign-in-container input[name="email"]');
  const loginPassword = document.querySelector('.sign-in-container input[name="password"]');

  // 이메일 유효성 검사
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  checkBtn.addEventListener('click', async () => {
    const email = emailInput.value.trim();

    // 1) 빈값 및 형식 체크
    if (!email) {
      feedback.textContent    = '이메일을 입력해주세요.';
      feedback.className      = 'email-feedback error';
      signupBtn.disabled      = true;
      return;
    }
    if (!validateEmail(email)) {
      feedback.textContent    = '이메일 형식을 확인해주세요.';
      feedback.className      = 'email-feedback error';
      signupBtn.disabled      = true;
      return;
    }

    // 2) 요청 전 UI
    checkBtn.disabled       = true;
    feedback.textContent    = '확인 중...';
    feedback.className      = 'email-feedback';

    try {
      // 3) AJAX 중복 확인
      const resp = await fetch('/api/member/checkEmail', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email })
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

      // 4) 결과 처리
      const isTaken = await resp.json();  // true = 이미 사용 중
      if (!isTaken) {
        feedback.textContent = '사용 가능한 이메일입니다.';
        feedback.className   = 'email-feedback success';
        signupBtn.disabled   = false;
      } else {
        feedback.textContent = '이미 사용 중인 이메일입니다.';
        feedback.className   = 'email-feedback error';
        signupBtn.disabled   = true;
      }
    } catch (err) {
      console.error(err);
      feedback.textContent = '확인에 실패했습니다. 다시 시도해주세요.';
      feedback.className   = 'email-feedback error';
      signupBtn.disabled   = true;
    } finally {
      checkBtn.disabled = false;
    }
  });

  // login.js 에서 showToast 함수만 교체
  function showToast(message, duration = 3000) {
    // 1) 로그인 옵션 영역 찾기
    const signInOptions = document.querySelector('.sign-in-container .options');
    // 2) 토스트 엘리먼트 생성
    const toast = document.createElement('div');
    toast.className = 'toast-login';
    toast.textContent = message;
    // 3) 옵션 바로 아래에 삽입
    signInOptions.insertAdjacentElement('afterend', toast);
    // 4) 표시 애니메이션
    requestAnimationFrame(() => toast.classList.add('show'));
    // 5) duration 후 제거
    setTimeout(() => {
      toast.classList.remove('show');
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, duration);
  }
  
  // 회원가입 처리
  signupBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    if (signupBtn.disabled) return;
	
	// **여기서 HTML5 required 검증**
	if (!signupForm.checkValidity()) {
	  signupForm.reportValidity();
	  return;
	}
    // FormData → JSON
    const formData   = new FormData(signupForm);
    const payload    = {};
    formData.forEach((v, k) => payload[k] = v);

    try {
      // 회원가입
      const resp = await fetch('/api/member/save', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload)
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

      const success = await resp.json();
      if (success) {
        // 성공 토스트
        showToast('🎉 회원가입이 완료되었습니다!');

        // 로그인 폼에 값 이관
        loginEmail.value    = payload.email;
        loginPassword.value = payload.password;

        // 초기화 & 패널 전환
        signupForm.reset();
		feedback.textContent ='';
        container.classList.remove('sign-up-mode');
      } else {
        showToast('회원가입에 실패했습니다.', 3000);
      }
    } catch (err) {
      console.error(err);
      showToast('⚠️ 회원가입 중 오류가 발생했습니다.', 3000);
    }
  });
});
