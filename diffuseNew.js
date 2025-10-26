// 헤더 숨김/표시 제어
let lastScrollY = 0;
let ticking = false;
let scrollDirection = 'down';
let headerHidden = false;

const header = document.querySelector('.main-header');
const menuToggle = document.querySelector('.menu-toggle');
const sideMenu = document.querySelector('.side-menu');
const menuOverlay = document.querySelector('.menu-overlay');

// 헤더 숨김/표시 함수
function updateHeaderVisibility() {
    const scrolled = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const scrollThreshold = windowHeight * 0.3; // 30% 스크롤
    
    // 메뉴가 열려있을 때는 헤더 숨김 방지
    if (sideMenu.classList.contains('active')) {
        return;
    }
    
    // 스크롤 방향 감지
    if (scrolled > lastScrollY) {
        scrollDirection = 'down';
    } else {
        scrollDirection = 'up';
    }
    
    // 헤더 숨김/표시 로직
    if (scrolled > scrollThreshold && scrollDirection === 'down' && !headerHidden) {
        header.classList.add('hidden');
        headerHidden = true;
    } else if (scrollDirection === 'up' && headerHidden) {
        header.classList.remove('hidden');
        headerHidden = false;
    }
    
    // 최상단에서는 항상 헤더 표시
    if (scrolled === 0) {
        header.classList.remove('hidden');
        headerHidden = false;
    }
}

// 햄버거 메뉴 토글
function toggleMenu() {
    const isActive = menuToggle.classList.contains('active');
    
    if (isActive) {
        closeMenu();
    } else {
        openMenu();
    }
}

function openMenu() {
    menuToggle.classList.add('active');
    sideMenu.classList.add('active');
    menuOverlay.classList.add('active');
    header.classList.add('menu-open'); // 로고 색상 변경용
    document.body.style.overflow = 'hidden'; // 스크롤 방지
    
    // About 페이지에서는 햄버거 라인의 인라인 스타일 제거
    const isAboutPage = document.body.classList.contains('about-page');
    if (isAboutPage) {
        const hamburgerLines = document.querySelectorAll('.hamburger-line');
        hamburgerLines.forEach(line => {
            line.style.background = '';
            line.style.boxShadow = '';
        });
    }
    
    // aria-label 업데이트
    menuToggle.setAttribute('aria-label', '메뉴 닫기');
}

function closeMenu() {
    menuToggle.classList.remove('active');
    sideMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    header.classList.remove('menu-open'); // 로고 색상 원복
    document.body.style.overflow = ''; // 스크롤 복원
    
    // About 페이지에서는 햄버거 라인을 흰색으로 복원
    const isAboutPage = document.body.classList.contains('about-page');
    if (isAboutPage) {
        const hamburgerLines = document.querySelectorAll('.hamburger-line');
        hamburgerLines.forEach(line => {
            line.style.background = '#ffffff';
            line.style.boxShadow = '1px 1px 2px rgba(0,0,0,0.3)';
        });
    }
    
    // aria-label 업데이트
    menuToggle.setAttribute('aria-label', '메뉴 열기');
}

// 메뉴 이벤트 리스너
const menuClose = document.querySelector('.menu-close');

menuToggle.addEventListener('click', toggleMenu);
menuOverlay.addEventListener('click', closeMenu);

// X 버튼 클릭 이벤트 추가
if (menuClose) {
    menuClose.addEventListener('click', closeMenu);
}

// ESC 키로 메뉴 닫기
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sideMenu.classList.contains('active')) {
        closeMenu();
    }
});

// 패럴랙스 스크롤 효과 - 섹션별 독립 처리
function updateParallax() {
    const scrolled = window.pageYOffset;
    const scrollDelta = scrolled - lastScrollY;
    
    // 헤더 업데이트
    updateHeaderVisibility();
    
    // 각 섹션의 위치 확인
    const sectionOne = document.querySelector('.section-one');
    const sectionTwo = document.querySelector('.section-two');
    
    if (sectionOne) {
        const sectionOneRect = sectionOne.getBoundingClientRect();
        const sectionOneTop = sectionOneRect.top;
        const sectionOneBottom = sectionOneRect.bottom;
        
        // 첫번째 섹션이 뷰포트에 있을 때만 동작
        if (sectionOneTop < window.innerHeight && sectionOneBottom > 0) {
            // 첫번째 섹션의 우측 카드 컬럼
            const sectionOneRightColumn = sectionOne.querySelector('.right-column');
            if (sectionOneRightColumn) {
                // 섹션 내에서의 상대적 스크롤 위치 계산
                const sectionScrollProgress = Math.max(0, -sectionOneTop);
                const maxScroll = sectionOne.offsetHeight - window.innerHeight;
                
                // 섹션 범위 내에서만 패럴랙스 적용
                if (sectionScrollProgress <= maxScroll) {
                    const currentTransform = sectionOneRightColumn.style.transform || 'translateY(0px)';
                    const currentY = parseFloat(currentTransform.replace(/[^\d.-]/g, '')) || 0;
                    const newY = currentY - (scrollDelta * 0.1); // 0.1 속도로 조정
                    
                    // 최대 이동 거리 제한 (섹션을 벗어나지 않도록)
                    const maxTranslate = -80; // 초기 padding-top과 동일
                    const limitedY = Math.max(maxTranslate, Math.min(0, newY));
                    
                    sectionOneRightColumn.style.transform = `translateY(${limitedY}px)`;
                }
            }
        }
    }
    
    if (sectionTwo) {
        const sectionTwoRect = sectionTwo.getBoundingClientRect();
        const sectionTwoTop = sectionTwoRect.top;
        const sectionTwoBottom = sectionTwoRect.bottom;
        
        // 두번째 섹션이 뷰포트에 있을 때만 동작
        if (sectionTwoTop < window.innerHeight && sectionTwoBottom > 0) {
            // 두번째 섹션의 우측 카드 컬럼
            const sectionTwoRightColumn = sectionTwo.querySelector('.right-column');
            if (sectionTwoRightColumn) {
                // 섹션 내에서의 상대적 스크롤 위치 계산
                const sectionScrollProgress = Math.max(0, -sectionTwoTop);
                const maxScroll = sectionTwo.offsetHeight - window.innerHeight;
                
                // 섹션 범위 내에서만 패럴랙스 적용
                if (sectionScrollProgress <= maxScroll) {
                    // 두번째 섹션 진입 시 초기화
                    if (sectionTwoTop <= window.innerHeight && sectionTwoTop > 0) {
                        sectionTwoRightColumn.style.transform = 'translateY(0px)';
                    } else {
                        const currentTransform = sectionTwoRightColumn.style.transform || 'translateY(0px)';
                        const currentY = parseFloat(currentTransform.replace(/[^\d.-]/g, '')) || 0;
                        const newY = currentY - (scrollDelta * 0.1); // 0.1 속도로 조정
                        
                        // 최대 이동 거리 제한
                        const maxTranslate = -80;
                        const limitedY = Math.max(maxTranslate, Math.min(0, newY));
                        
                        sectionTwoRightColumn.style.transform = `translateY(${limitedY}px)`;
                    }
                }
            }
        }
    }
    
    lastScrollY = scrolled;
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
}

// 스크롤 이벤트 리스너
window.addEventListener('scroll', requestTick);

// Intersection Observer를 사용한 카드 페이드인 애니메이션
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// 모든 카드에 observer 적용
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        observer.observe(card);
    });
    
    // 섹션별 초기 설정
    const sectionOneRightColumn = document.querySelector('.section-one .right-column');
    const sectionTwoRightColumn = document.querySelector('.section-two .right-column');
    
    if (sectionOneRightColumn) {
        sectionOneRightColumn.style.transform = 'translateY(0px)';
    }
    if (sectionTwoRightColumn) {
        sectionTwoRightColumn.style.transform = 'translateY(0px)';
    }
});

// 부드러운 스크롤 효과
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 윈도우 리사이즈 처리
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // 모바일에서는 패럴랙스 효과 제거
        if (window.innerWidth <= 1024) {
            document.querySelectorAll('.right-column').forEach(column => {
                column.style.transform = 'translateY(0)';
            });
        }
        
        // 메뉴가 열려있는 상태에서 리사이즈 시 처리
        if (window.innerWidth > 1024 && sideMenu.classList.contains('active')) {
            closeMenu();
        }
    }, 250);
});

// 카드 클릭 이벤트
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', function() {
        console.log('Card clicked:', this.querySelector('.card-title').textContent);
    });
});

// 메뉴 링크 클릭 시 동작 (필요시 사용)
document.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const menuText = this.querySelector('.menu-text').textContent;
        console.log('Menu clicked:', menuText);
        
        // 메뉴 클릭 후 닫기 (선택사항)
        closeMenu();
        
        // 여기에 페이지 이동이나 섹션 스크롤 로직 추가 가능
    });
});

// 디버깅용 - 현재 스크롤 위치 모니터링 (개발 완료 후 제거 가능)
if (window.location.hash === '#debug') {
    const debugDiv = document.createElement('div');
    debugDiv.style.cssText = 'position:fixed;top:100px;right:10px;background:rgba(0,0,0,0.8);color:white;padding:10px;z-index:9999;font-family:monospace;font-size:12px;';
    document.body.appendChild(debugDiv);
    
    window.addEventListener('scroll', () => {
        const sectionOne = document.querySelector('.section-one');
        const sectionTwo = document.querySelector('.section-two');
        const scrollPercent = (window.pageYOffset / window.innerHeight * 100).toFixed(1);
        debugDiv.innerHTML = `
            Scroll: ${window.pageYOffset}px (${scrollPercent}%)<br>
            Direction: ${scrollDirection}<br>
            Header: ${headerHidden ? 'Hidden' : 'Visible'}<br>
            Section1 Top: ${sectionOne ? sectionOne.getBoundingClientRect().top.toFixed(0) : 'N/A'}px<br>
            Section2 Top: ${sectionTwo ? sectionTwo.getBoundingClientRect().top.toFixed(0) : 'N/A'}px
        `;
    });
}

// ========== 이메일 팝업 기능 ==========
const emailPopup = document.getElementById('emailPopup');
const popupTitle = document.getElementById('popupTitle');
const copyButton = document.getElementById('copyButton');
const popupClose = document.querySelector('.popup-close');

// 이메일 팝업 열기
function openEmailPopup(type = 'inquiry') {
    if (!emailPopup) return;
    
    // 팝업 타이틀 설정
    if (popupTitle) {
        popupTitle.textContent = type === 'proposal' ? '제휴 제안' : '문의하기';
    }
    
    // 팝업 열기
    emailPopup.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // 메뉴가 열려있으면 닫기
    if (sideMenu && sideMenu.classList.contains('active')) {
        closeMenu();
    }
}

// 이메일 팝업 닫기
function closeEmailPopup() {
    if (!emailPopup) return;
    
    emailPopup.classList.remove('active');
    document.body.style.overflow = '';
    
    // 복사 버튼 상태 초기화
    if (copyButton) {
        copyButton.classList.remove('copied');
        const buttonText = copyButton.querySelector('.button-text');
        const copyIcon = copyButton.querySelector('.copy-icon');
        const checkIcon = copyButton.querySelector('.check-icon');
        
        if (buttonText) buttonText.textContent = '복사하기';
        if (copyIcon) copyIcon.style.display = 'block';
        if (checkIcon) checkIcon.style.display = 'none';
    }
}

// 이메일 복사 기능
function copyEmail() {
    const emailText = document.querySelector('.email-text');
    if (!emailText) return;
    
    const email = emailText.textContent;
    
    // 클립보드에 복사
    navigator.clipboard.writeText(email).then(() => {
        // 복사 성공 시 버튼 상태 변경
        if (copyButton) {
            copyButton.classList.add('copied');
            const buttonText = copyButton.querySelector('.button-text');
            const copyIcon = copyButton.querySelector('.copy-icon');
            const checkIcon = copyButton.querySelector('.check-icon');
            
            if (buttonText) buttonText.textContent = '복사됨!';
            if (copyIcon) copyIcon.style.display = 'none';
            if (checkIcon) checkIcon.style.display = 'block';
            
            // 2초 후 원래 상태로 복원
            setTimeout(() => {
                copyButton.classList.remove('copied');
                if (buttonText) buttonText.textContent = '복사하기';
                if (copyIcon) copyIcon.style.display = 'block';
                if (checkIcon) checkIcon.style.display = 'none';
            }, 2000);
        }
    }).catch(err => {
        console.error('복사 실패:', err);
        alert('복사에 실패했습니다. 이메일 주소를 직접 복사해주세요.');
    });
}

// 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', () => {
    // 복사 버튼 클릭
    if (copyButton) {
        copyButton.addEventListener('click', copyEmail);
    }
    
    // 팝업 닫기 버튼
    if (popupClose) {
        popupClose.addEventListener('click', closeEmailPopup);
    }
    
    // 오버레이 클릭으로 닫기
    if (emailPopup) {
        emailPopup.addEventListener('click', (e) => {
            if (e.target === emailPopup) {
                closeEmailPopup();
            }
        });
    }
    
    // ESC 키로 팝업 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && emailPopup && emailPopup.classList.contains('active')) {
            closeEmailPopup();
        }
    });
    
    // 사이드 메뉴의 문의하기/제휴제안 링크 클릭 처리
    document.querySelectorAll('.menu-link[data-contact]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const contactType = link.dataset.contact;
            openEmailPopup(contactType);
        });
    });
    
    // 사이드 메뉴의 텍스트로 찾기 (data 속성이 없는 경우)
    document.querySelectorAll('.menu-link').forEach(link => {
        const menuText = link.querySelector('.menu-text')?.textContent;
        if (menuText && (menuText.includes('문의') || menuText.includes('ë¬¸ì˜'))) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                openEmailPopup('inquiry');
            });
        } else if (menuText && (menuText.includes('제휴') || menuText.includes('ì œíœ´'))) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                openEmailPopup('proposal');
            });
        }
    });
    
    // 푸터의 문의하기/제휴제안 링크 클릭 처리
    document.querySelectorAll('.footer-column a').forEach(link => {
        const linkText = link.textContent;
        if (linkText && (linkText.includes('문의') || linkText.includes('ë¬¸ì˜'))) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                openEmailPopup('inquiry');
            });
        } else if (linkText && (linkText.includes('제휴') || linkText.includes('ì œíœ´'))) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                openEmailPopup('proposal');
            });
        }
    });
});