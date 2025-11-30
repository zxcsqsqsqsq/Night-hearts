// Плавная навигация
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

// Обработка формы заявки в админы
const applyForm = document.getElementById('applyForm');
if (applyForm) {
    applyForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formMessage = document.getElementById('formMessage');
        const submitButton = this.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        
        // Собираем данные формы
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            telegram: document.getElementById('telegram').value,
            adminType: document.getElementById('adminType').value,
            experience: document.getElementById('experience').value,
            reason: document.getElementById('reason').value
        };
        
        // Показываем загрузку
        submitButton.disabled = true;
        submitButton.innerHTML = '<span>⏳</span> Отправка...';
        formMessage.innerHTML = '';
        formMessage.className = '';
        
        try {
            const FORMSPREE_ID = 'f/mldyywyg';
            
            // Формируем данные в формате URL-encoded (нужно для Formspree)
            const formDataEncoded = new URLSearchParams();
            formDataEncoded.append('fullName', formData.fullName);
            formDataEncoded.append('email', formData.email);
            formDataEncoded.append('telegram', formData.telegram);
            formDataEncoded.append('adminType', formData.adminType);
            formDataEncoded.append('experience', formData.experience);
            formDataEncoded.append('reason', formData.reason);
            
            const response = await fetch(`https://formspree.io/${FORMSPREE_ID}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: formDataEncoded
            });
            
            const result = await response.json();
            
            if (response.ok) {
                formMessage.className = 'form-message success';
                formMessage.innerHTML = '✅ Заявка успешно отправлена! Проверь почту.';
                applyForm.reset();
                
                // Скрываем сообщение через 5 секунд
                setTimeout(() => {
                    formMessage.innerHTML = '';
                    formMessage.className = '';
                }, 5000);
            } else {
                formMessage.className = 'form-message error';
                formMessage.innerHTML = '❌ Ошибка отправки. Попробуй позже.';
            }
        } catch (error) {
            formMessage.className = 'form-message error';
            formMessage.innerHTML = '❌ Ошибка сети. Проверь интернет и попробуй снова.';
            console.error('Ошибка:', error);
        }
        
        // Восстанавливаем кнопку
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    });
}

// Эффект при скроллинге для навбара
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.background = 'linear-gradient(to bottom, rgba(26, 31, 58, 0.95), transparent)';
    } else {
        navbar.style.background = 'linear-gradient(to bottom, rgba(26, 31, 58, 0.98), rgba(26, 31, 58, 0.95))';
        navbar.style.boxShadow = '0 5px 30px rgba(255, 20, 147, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Анимация при появлении элементов в поле зрения
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Наблюдаем за карточками
document.querySelectorAll('.feature-card, .review-card, .about-item').forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    observer.observe(el);
});

// Интерактивные эффекты на кнопки
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Эффект клика на кнопку
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', function(e) {
        // Ripple effect
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.width = '10px';
        ripple.style.height = '10px';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.borderRadius = '50%';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'ripple 0.6s ease-out';
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Добавляем CSS для ripple анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            width: 300px;
            height: 300px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Активная ссылка в меню при скролле
window.addEventListener('scroll', () => {
    let current = '';
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.style.color = '#ff1493';
        } else {
            link.style.color = '#e0e0e0';
        }
    });
});

// Загрузка страницы с анимацией
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';
document.body.style.opacity = '1';

// Счетчик для статистики (опционально)
const animateCounter = (element, target, duration = 2000) => {
    let current = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
};

// Подсветка активного пункта меню
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.style.color = '#e0e0e0');
            this.style.color = '#ff1493';
        });
    });
});

console.log('🎉 Сайт Ночное сердце успешно загружен!');

// ========== VOTING SYSTEM ==========
const candidates = ['дикси', 'вискас', 'эндорфин', 'денир', 'сонная'];

// Инициализация голосов из localStorage
function initializeVotes() {
    const savedVotes = localStorage.getItem('coOwnerVotes');
    if (!savedVotes) {
        const initialVotes = {};
        candidates.forEach(candidate => {
            initialVotes[candidate] = 0;
        });
        localStorage.setItem('coOwnerVotes', JSON.stringify(initialVotes));
    }
}

// Получить текущий IP пользователя для отслеживания голоса (максимально простой способ)
function getUserVoteKey() {
    let userKey = localStorage.getItem('userVoteKey');
    if (!userKey) {
        userKey = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('userVoteKey', userKey);
    }
    return userKey;
}

// Получить голос пользователя
function getUserVote() {
    const userKey = getUserVoteKey();
    return localStorage.getItem(userKey + '_voted_for');
}

// Обновить отображение голосов
function updateVoteDisplay() {
    const votes = JSON.parse(localStorage.getItem('coOwnerVotes') || '{}');
    const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
    
    // Обновляем карточки голосования
    candidates.forEach(candidate => {
        const count = votes[candidate] || 0;
        const countElement = document.querySelector(`[data-count="${candidate}"]`);
        if (countElement) {
            countElement.textContent = count + (count % 10 === 1 && count !== 11 ? ' голос' : count % 10 >= 2 && count % 10 <= 4 && (count < 10 || count >= 20) ? ' голоса' : ' голосов');
        }
        
        // Обновляем результаты
        const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
        const resultItem = document.querySelector(`[data-result="${candidate}"]`);
        if (resultItem) {
            const resultBar = resultItem.querySelector('.result-fill');
            const resultPercent = resultItem.querySelector('.result-percent');
            if (resultBar) resultBar.style.width = percent + '%';
            if (resultPercent) resultPercent.textContent = percent + '%';
        }
    });
    
    // Обновляем состояние кнопок
    const userVote = getUserVote();
    document.querySelectorAll('.vote-btn').forEach(btn => {
        const candidate = btn.getAttribute('data-vote');
        if (userVote === candidate) {
            btn.classList.add('voted');
            btn.disabled = true;
            btn.textContent = '✅ Вы голосовали';
        } else if (userVote) {
            btn.disabled = true;
            btn.style.opacity = '0.5';
        } else {
            btn.classList.remove('voted');
            btn.disabled = false;
            btn.textContent = 'Голосовать';
            btn.style.opacity = '1';
        }
    });
}

// Обработчик клика по кнопке голосования
function setupVotingButtons() {
    document.querySelectorAll('.vote-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const candidate = this.getAttribute('data-vote');
            const userKey = getUserVoteKey();
            const votes = JSON.parse(localStorage.getItem('coOwnerVotes') || '{}');
            
            // Проверяем, голосовал ли пользователь уже
            if (localStorage.getItem(userKey + '_voted_for')) {
                alert('Вы уже голосовали! Спасибо за участие 💙');
                return;
            }
            
            // Добавляем голос
            votes[candidate] = (votes[candidate] || 0) + 1;
            localStorage.setItem('coOwnerVotes', JSON.stringify(votes));
            localStorage.setItem(userKey + '_voted_for', candidate);
            
            // Показываем уведомление
            this.textContent = '✅ Голос учтён!';
            this.classList.add('voted');
            
            // Обновляем отображение
            updateVoteDisplay();
            
            setTimeout(() => {
                this.textContent = 'Спасибо!';
            }, 500);
        });
    });
}

// Инициализация системы голосования при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initializeVotes();
    updateVoteDisplay();
    setupVotingButtons();
    
    // Обновляем отображение каждые 2 секунды (для синхронизации между вкладками)
    setInterval(updateVoteDisplay, 2000);
});
