// About 페이지 전용 스크롤 처리
document.addEventListener('DOMContentLoaded', function() {
    // About 페이지인지 확인
    const isAboutPage = document.body.classList.contains('about-page');
    if (!isAboutPage) return;
    
    // 헤더 초기 설정
    const header = document.querySelector('.main-header');
    const logo = header?.querySelector('.logo a');
    const hamburgerLines = header?.querySelectorAll('.hamburger-line');
    
    // 초기 스타일 설정 함수
    function setInitialStyles() {
        if (header) {
            header.style.background = 'transparent';
            header.style.backdropFilter = 'none';
            header.style.borderBottom = 'none';
        }
        
        if (logo) {
            logo.style.color = '#ffffff';
            logo.style.textShadow = '2px 2px 4px rgba(0,0,0,0.3)';
        }
        
        // 햄버거 초기 색상 설정 (메뉴가 열려있지 않을 때만)
        if (hamburgerLines && !header?.classList.contains('menu-open')) {
            hamburgerLines.forEach(line => {
                line.style.background = '#ffffff';
                line.style.boxShadow = '1px 1px 2px rgba(0,0,0,0.3)';
            });
        }
    }
    
    // 스크롤 이벤트 처리
    function handleScroll() {
        const scrolled = window.pageYOffset;
        
        if (!header) return;
        
        // 헤더 항상 표시
        header.classList.remove('hidden');
        header.style.transform = 'translateY(0)';
        
        if (scrolled > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.1)';
            header.style.backdropFilter = 'blur(20px)';
            header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.2)';
        } else {
            header.style.background = 'transparent';
            header.style.backdropFilter = 'none';
            header.style.borderBottom = 'none';
        }
    }
    
    // 초기 스타일 적용
    setInitialStyles();
    
    // 스크롤 이벤트 리스너
    window.addEventListener('scroll', handleScroll);
    
    // 헤더 숨김 방지 (주기적 체크)
    setInterval(() => {
        if (header) {
            header.classList.remove('hidden');
            header.style.transform = 'translateY(0)';
        }
    }, 100);
});