// DOM元素加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 页面加载动画
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('mainContent');
    
    // 模拟加载过程
    setTimeout(function() {
        loader.style.opacity = '0';
        setTimeout(function() {
            loader.style.display = 'none';
            mainContent.style.display = 'block';
            initAll();
        }, 500);
    }, 2000);
});

// 初始化所有功能
function initAll() {
    initAudio();
    initHeartButton();
    initInteractions();
    initHearts();
    initBows();
    initRabbits();
    initCats();
    initImageViewer();
    initSurpriseModal();
}

// 图片查看器初始化
function initImageViewer() {
    // 图片查看器变量
    const imageViewer = document.getElementById('imageViewer');
    const viewerImage = document.getElementById('viewerImage');
    const caption = document.getElementById('caption');
    const closeBtn = document.querySelector('.close');
    let currentItem = null;
    let currentIndex = -1;
    
    // 确保所有必要的元素都存在
    if (!imageViewer || !viewerImage || !caption || !closeBtn) {
        return; // 如果缺少任何必要的元素，就不初始化图片查看器
    }
    
    // 为相册容器添加点击事件委托，处理所有gallery-item的点击
    const galleryContainer = document.querySelector('.gallery');
    if (galleryContainer) {
        galleryContainer.addEventListener('click', function(e) {
            const galleryItem = e.target.closest('.gallery-item');
            if (galleryItem) {
                const imgSrc = galleryItem.getAttribute('data-img');
                const imgTitle = galleryItem.getAttribute('data-title');
                const imgDesc = galleryItem.getAttribute('data-description');
                
                if (imgSrc) {
                    viewerImage.src = imgSrc;
                    caption.innerHTML = imgTitle ? `${imgTitle} - ${imgDesc || ''}` : '';
                    imageViewer.classList.add('show');
                    imageViewer.style.display = 'block';
                    currentItem = galleryItem;
                    
                    // 获取当前点击项的索引
                    const allGalleryItems = document.querySelectorAll('.gallery-item');
                    currentIndex = Array.from(allGalleryItems).indexOf(galleryItem);
                    
                    playClickSound();
                }
            }
        });
    }
    
    // 关闭按钮点击事件
    closeBtn.addEventListener('click', function() {
        imageViewer.classList.remove('show');
        
        setTimeout(() => {
            imageViewer.style.display = 'none';
            currentItem = null;
            currentIndex = -1;
        }, 300);
        
        playClickSound();
    });
    
    // 点击外部关闭查看器
    window.addEventListener('click', function(e) {
        if (e.target === imageViewer) {
            imageViewer.classList.remove('show');
            
            setTimeout(() => {
                imageViewer.style.display = 'none';
                currentItem = null;
                currentIndex = -1;
            }, 300);
        }
    });
}

// 惊喜弹窗初始化
function initSurpriseModal() {
    const surpriseBtn = document.getElementById('surpriseBtn');
    const surpriseModal = document.getElementById('surpriseModal');
    const modalClose = document.querySelector('.modal-close');
    const modalHeartButton = document.getElementById('modalHeartButton');
    const modalHeartCount = document.getElementById('modalHeartCount');
    
    // 确保所有必要的元素都存在
    if (!surpriseBtn || !surpriseModal || !modalClose) {
        return;
    }
    
    // 打开弹窗
    surpriseBtn.addEventListener('click', function() {
        surpriseModal.style.display = 'block';
        
        // 添加彩屑效果
        createConfetti();
        
        // 播放弹出音效
        playPopSound();
        
        // 添加弹窗进入动画
        const modalContent = surpriseModal.querySelector('.modal-content');
        if (modalContent) {
            // 重置动画
            modalContent.style.animation = 'none';
            modalContent.offsetHeight; // 触发重排
            modalContent.style.transform = 'scale(0) rotate(180deg)';
            setTimeout(() => {
                modalContent.style.animation = 'modalBounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
            }, 10);
        }
    });
    
    // 关闭弹窗
    modalClose.addEventListener('click', function() {
        surpriseModal.style.display = 'none';
        playClickSound();
    });
    
    // 点击外部关闭弹窗
    window.addEventListener('click', function(e) {
        if (e.target === surpriseModal) {
            surpriseModal.style.display = 'none';
        }
    });
    
    // 弹窗内部爱心按钮功能
    if (modalHeartButton && modalHeartCount) {
        let count = 0;
        
        modalHeartButton.addEventListener('click', function(event) {
            count++;
            modalHeartCount.textContent = count;
            
            // 添加计数脉冲动画
            modalHeartCount.classList.add('pulse');
            setTimeout(() => modalHeartCount.classList.remove('pulse'), 300);
            
            // 创建爱心动画
            createHeartAnimation(event);
            
            // 播放音效
            playClickSound();
            
            // 按钮缩放动画
            modalHeartButton.style.transform = 'scale(1.2)';
            setTimeout(function() {
                modalHeartButton.style.transform = 'scale(1)';
            }, 200);
        });
    }
}

// 全局音频变量
let clickSound = null;
let popSound = null;
let soundEnabled = true;

// 播放点击音效
function playClickSound() {
    if (soundEnabled && clickSound) {
        try {
            clickSound.currentTime = 0;
            clickSound.play();
        } catch (e) {
            // 忽略播放错误
        }
    }
}

// 播放弹出音效
function playPopSound() {
    if (soundEnabled && popSound) {
        try {
            popSound.currentTime = 0;
            popSound.play();
        } catch (e) {
            // 忽略播放错误
        }
    }
}

// 音频控制
function initAudio() {
    const bgMusic = document.getElementById('bgMusic');
    clickSound = document.getElementById('clickSound');
    popSound = document.getElementById('popSound');
    const musicToggle = document.getElementById('musicToggle');
    const soundToggle = document.getElementById('soundToggle');

    let musicEnabled = true;

    // 背景音乐控制
    if (musicToggle && bgMusic) {
        musicToggle.addEventListener('click', function() {
            if (musicEnabled) {
                bgMusic.pause();
                musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            } else {
                bgMusic.play();
                musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            }
            musicEnabled = !musicEnabled;
        });
    }

    // 音效控制
    if (soundToggle) {
        soundToggle.addEventListener('click', function() {
            soundEnabled = !soundEnabled;
            soundToggle.innerHTML = soundEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
        });
    }

    // 为所有导航链接添加点击音效
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            if (soundEnabled && clickSound) {
                try {
                    clickSound.currentTime = 0;
                    clickSound.play();
                } catch (e) {
                    // 忽略播放错误
                }
            }
        });
    });

    // 为所有按钮添加点击音效
    const buttons = document.querySelectorAll('button');
    buttons.forEach(function(button) {
        button.addEventListener('click', function() {
            if (soundEnabled && popSound) {
                try {
                    popSound.currentTime = 0;
                    popSound.play();
                } catch (e) {
                    // 忽略播放错误
                }
            }
        });
    });
}
    


// 创建图片画廊点击效果
function createGalleryClickEffect(event) {
    // 创建爱心爆炸效果
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '<i class="fas fa-heart"></i>';
        heart.style.position = 'fixed';
        heart.style.left = event.clientX + 'px';
        heart.style.top = event.clientY + 'px';
        heart.style.color = ['#ff69b4', '#ff1493', '#ffb6c1', '#ffc0cb', '#ff8fab'][Math.floor(Math.random() * 5)];
        heart.style.fontSize = (Math.random() * 1.5 + 0.8) + 'rem';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '9999';
        
        // 随机方向和速度
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 120 + 30;
        const duration = Math.random() * 1.2 + 0.4;
        
        heart.style.animation = `galleryHeartExplosion ${duration}s ease-out forwards`;
        heart.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        // 添加动画关键帧
        if (i === 0) {
            const style = document.createElement('style');
            style.textContent = `
                @keyframes galleryHeartExplosion {
                    0% {
                        transform: translate(0, 0) scale(0);
                        opacity: 1;
                    }
                    50% {
                        opacity: 1;
                    }
                    100% {
                        transform: translate(calc(cos(${angle}) * ${distance}px), calc(sin(${angle}) * ${distance}px)) scale(1.5);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
            
            // 动画结束后移除样式
            setTimeout(function() {
                style.remove();
            }, duration * 1000);
        }
        
        document.body.appendChild(heart);
        
        // 动画结束后移除元素
        setTimeout(function() {
            heart.remove();
        }, duration * 1000);
    }
}

// 爱心按钮互动
function initHeartButton() {
    const heartButton = document.getElementById('heartButton');
    const heartCount = document.getElementById('heartCount');
    
    // 确保元素存在
    if (!heartButton || !heartCount) {
        return;
    }
    
    let count = 0;
    
    heartButton.addEventListener('click', function(event) {
        count++;
        heartCount.textContent = count;
        
        // 添加计数脉冲动画
        heartCount.classList.add('pulse');
        setTimeout(() => heartCount.classList.remove('pulse'), 300);
        
        // 创建爱心动画
        createHeartAnimation(event);
        
        // 播放音效
        playClickSound();
        
        // 按钮缩放动画
        heartButton.style.transform = 'scale(1.2)';
        setTimeout(function() {
            heartButton.style.transform = 'scale(1)';
        }, 200);
    });
}

// 雪花效果
function initSnowflakes() {
    const snowflakesContainer = document.getElementById('snowflakes');
    const numberOfSnowflakes = 50;
    
    // 确保容器存在
    if (!snowflakesContainer) {
        return;
    }
    
    for (let i = 0; i < numberOfSnowflakes; i++) {
        createSnowflake(snowflakesContainer);
    }
}

function createSnowflake(container) {
    // 确保容器存在
    if (!container) {
        return;
    }
    
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    
    // 随机大小
    const size = Math.random() * 10 + 5;
    snowflake.style.width = size + 'px';
    snowflake.style.height = size + 'px';
    
    // 随机初始位置
    snowflake.style.left = Math.random() * 100 + 'vw';
    snowflake.style.top = -10 + 'px';
    
    // 随机颜色
    const opacity = Math.random() * 0.5 + 0.5;
    snowflake.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
    
    // 随机动画持续时间
    const duration = Math.random() * 10 + 10;
    snowflake.style.animationDuration = duration + 's';
    
    // 随机延迟
    const delay = Math.random() * 5;
    snowflake.style.animationDelay = delay + 's';
    
    // 随机水平摆动
    const swing = Math.random() * 50 - 25;
    snowflake.style.transform = `translateX(${swing}px)`;
    snowflake.style.animationTimingFunction = 'linear';
    
    container.appendChild(snowflake);
    
    // 雪花消失后重新创建
    setTimeout(function() {
        snowflake.remove();
        createSnowflake(container);
    }, (duration + delay) * 1000);
}

// 初始化所有交互元素
function initInteractions() {
    // 为所有按钮添加点击音效
    const buttons = document.querySelectorAll('button, .surprise-btn, .gallery-item');
    buttons.forEach(function(button) {
        // 不为发布页面的类型选择按钮添加额外的点击事件监听器
        if (!button.classList.contains('type-btn')) {
            button.addEventListener('click', function(e) {
                if (!e.target.closest('.control-btn') && !e.target.closest('.modal-close') && !e.target.closest('.close')) {
                    playClickSound();
                }
            });
        }
    });
    
    // 为页面添加滚动动画
    const sections = document.querySelectorAll('.section');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    sections.forEach(function(section) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
}

// 创建爱心动画
function createHeartAnimation(event) {
    // 创建多个爱心效果
    for (let i = 0; i < 8; i++) { // 减少爱心数量以提高性能
        const heart = document.createElement('div');
        heart.innerHTML = '<i class="fas fa-heart"></i>';
        heart.style.position = 'fixed';
        heart.style.left = event.clientX + 'px';
        heart.style.top = event.clientY + 'px';
        heart.style.color = ['#ff69b4', '#ff1493', '#ffb6c1', '#ffc0cb', '#ff8fab'][Math.floor(Math.random() * 5)];
        heart.style.fontSize = (Math.random() * 2 + 1) + 'rem';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '9999';
        
        // 随机方向和速度
        const duration = Math.random() * 1.5 + 0.5;
        const rotation = Math.random() * 360;
        
        // 使用CSS变量来控制动画参数
        heart.style.setProperty('--distance', (Math.random() * 150 + 50) + 'px');
        heart.style.setProperty('--angle', (Math.random() * 360) + 'deg');
        heart.style.setProperty('--rotation', rotation + 'deg');
        
        heart.style.animation = `heartExplosion ${duration}s ease-out forwards`;
        heart.style.transform = `rotate(${rotation}deg)`;
        
        document.body.appendChild(heart);
        
        // 动画结束后移除元素
        heart.addEventListener('animationend', () => heart.remove());
    }
}

// 创建庆祝效果
function createConfetti() {
    const colors = ['#ff69b4', '#ff1493', '#ffb6c1', '#ffc0cb', '#ff8fab'];
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    
    // 创建60个彩屑（减少数量以提高性能）
    for (let i = 0; i < 60; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-20px';
        confetti.style.borderRadius = '50%';
        confetti.style.opacity = Math.random() * 0.5 + 0.5;
        
        // 随机动画参数
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 2;
        const swing1 = Math.random() * 50 - 25;
        const swing2 = Math.random() * 100 - 50;
        const rotation = Math.random() * 360;
        
        // 使用CSS变量来控制动画参数
        confetti.style.setProperty('--swing1', swing1 + 'px');
        confetti.style.setProperty('--swing2', swing2 + 'px');
        confetti.style.setProperty('--rotation', rotation + 'deg');
        
        confetti.style.animation = `confettiFall ${duration}s ease-in ${delay}s forwards`;
        container.appendChild(confetti);
    }
    
    // 清理容器
    setTimeout(function() {
        container.remove();
    }, 7000);
}

// 星星装饰效果
function initStars() {
    const numberOfStars = 30;
    const container = document.getElementById('mainContent');
    
    // 确保容器存在
    if (!container) {
        return;
    }
    
    for (let i = 0; i < numberOfStars; i++) {
        createStar(container);
    }
}

function createStar(container) {
    // 确保容器存在
    if (!container) {
        return;
    }
    
    const star = document.createElement('div');
    star.className = 'star';
    
    // 随机大小
    const size = Math.random() * 10 + 5;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    
    // 随机初始位置
    star.style.left = Math.random() * 100 + 'vw';
    star.style.top = Math.random() * 100 + 'vh';
    
    // 随机颜色
    const colors = ['#fff', '#ffd700', '#ffb6c1', '#ffc0cb'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    star.style.backgroundColor = color;
    
    // 随机动画持续时间
    const duration = Math.random() * 3 + 2;
    star.style.animationDuration = duration + 's';
    
    // 随机延迟
    const delay = Math.random() * 5;
    star.style.animationDelay = delay + 's';
    
    container.appendChild(star);
    
    // 星星可以随机移动
    setTimeout(function() {
        star.style.transition = 'all 2s ease';
        star.style.left = Math.random() * 100 + 'vw';
        star.style.top = Math.random() * 100 + 'vh';
    }, (duration + delay) * 1000);
}

// 触摸设备优化
document.addEventListener('touchstart', function() {
    // 防止默认触摸行为
    if (event.target.closest('.gallery-item') || event.target.closest('.heart-button') || event.target.closest('.surprise-btn')) {
        event.preventDefault();
    }
});

// 键盘事件支持
document.addEventListener('keydown', function(event) {
    // ESC键关闭弹窗和查看器
    if (event.key === 'Escape') {
        const modal = document.getElementById('surpriseModal');
        const viewer = document.getElementById('imageViewer');
        
        if (modal.style.display === 'block') {
            modal.style.display = 'none';
        }
        
        if (viewer.style.display === 'block') {
            viewer.style.display = 'none';
        }
    }
});

// 预加载音频文件

// 初始化愿望功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取愿望相关元素
    const wishInput = document.getElementById('wishInput');
    const wishSubmit = document.getElementById('wishSubmit');
    const wishCount = document.getElementById('wishCount');
    const wishMessage = document.getElementById('wishMessage');
    const wishStars = document.getElementById('wishStars');
    
    // 更新愿望字数计数
    function updateWishCount() {
        const count = wishInput.value.length;
        if (wishCount) {
            wishCount.textContent = `${count}/100`;
        }
    }
    
    // 处理愿望提交
    function handleWishSubmit() {
        if (!wishInput || !wishMessage || !wishStars) return;
        
        const wishText = wishInput.value.trim();
        
        if (!wishText) {
            // 显示提示
            wishMessage.textContent = '请先写下你的愿望哦~';
            wishMessage.style.color = '#ff69b4';
            wishMessage.classList.add('show');
            
            setTimeout(() => {
                wishMessage.classList.remove('show');
            }, 2000);
            
            return;
        }
        
        // 保存愿望到localStorage
        saveWishToStorage(wishText);
        
        // 清空输入框
        wishInput.value = '';
        updateWishCount();
        
        // 显示愿望
        wishMessage.textContent = wishText;
        wishMessage.style.color = '#ff69b4';
        wishMessage.classList.add('show');
        
        // 创建星星效果
        createWishStars();
        
        // 创建流星效果
        createFallingStars();
        
        // 播放音效
        playClickSound();
        playPopSound();
        
        // 3秒后隐藏愿望和星星
        setTimeout(() => {
            wishMessage.classList.remove('show');
            wishStars.classList.remove('show');
            wishStars.innerHTML = '';
        }, 5000);
    }
    
    // 保存愿望到localStorage
    function saveWishToStorage(wishText) {
        try {
            // 获取现有愿望
            const savedWishes = JSON.parse(localStorage.getItem('happyWishes') || '[]');
            
            // 添加新愿望（包含时间戳）
            const newWish = {
                id: Date.now(),
                text: wishText,
                timestamp: new Date().toISOString()
            };
            
            // 保存回localStorage
            savedWishes.push(newWish);
            localStorage.setItem('happyWishes', JSON.stringify(savedWishes));
        } catch (error) {
            console.log('保存愿望失败:', error);
        }
    }
    
    // 创建愿望星星
    function createWishStars() {
        if (!wishStars) return;
        
        // 清空现有星星
        wishStars.innerHTML = '';
        
        // 创建5个星星
        for (let i = 0; i < 5; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.innerHTML = '<i class="fas fa-star"></i>';
            wishStars.appendChild(star);
        }
        
        // 显示星星
        setTimeout(() => {
            wishStars.classList.add('show');
        }, 300);
    }
    
    // 创建流星效果
    function createFallingStars() {
        const container = document.getElementById('mainContent');
        if (!container) return;
        
        const colors = ['#ffd700', '#ff69b4', '#ffffff', '#00bfff', '#9370db'];
        
        for (let i = 0; i < 15; i++) {
            const star = document.createElement('div');
            star.className = 'falling-star';
            star.innerHTML = '<i class="fas fa-star"></i>';
            
            // 随机位置
            star.style.left = Math.random() * 100 + 'vw';
            star.style.top = Math.random() * 20 + 'vh';
            
            // 随机动画持续时间
            const duration = Math.random() * 2 + 1.5;
            star.style.animationDuration = duration + 's';
            
            // 随机大小
            const size = Math.random() * 2 + 1;
            star.style.fontSize = size + 'rem';
            
            // 随机颜色
            star.style.color = colors[Math.floor(Math.random() * colors.length)];
            
            // 随机不透明度
            star.style.opacity = Math.random() * 0.5 + 0.5;
            
            container.appendChild(star);
            
            // 动画结束后移除
            setTimeout(() => {
                star.remove();
            }, duration * 1000);
        }
    }
    
    // 查看愿望功能
    const viewWishesBtn = document.getElementById('viewWishes');
    const closeWishesBtn = document.getElementById('closeWishes');
    const savedWishesList = document.getElementById('savedWishesList');
    const wishesList = document.getElementById('wishesList');
    
    // 显示保存的愿望
    function showSavedWishes() {
        if (!savedWishesList || !wishesList) return;
        
        try {
            // 获取保存的愿望
            const savedWishes = JSON.parse(localStorage.getItem('happyWishes') || '[]');
            
            if (savedWishes.length === 0) {
                wishesList.innerHTML = '<p style="text-align: center; color: #ff69b4; font-family: \'Caveat\', cursive; font-size: 1.2rem;">还没有保存的愿望哦~</p>';
            } else {
                // 按时间倒序排列（最新的愿望在前面）
                savedWishes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                
                // 渲染愿望列表
                wishesList.innerHTML = savedWishes.map(wish => {
                    // 格式化日期
                    const date = new Date(wish.timestamp);
                    const formattedDate = `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
                    
                    return `
                        <div class="wish-item">
                            <div class="wish-text">${wish.text}</div>
                            <div class="wish-date">✨ ${formattedDate}</div>
                        </div>
                    `;
                }).join('');
            }
            
            // 显示愿望列表
            savedWishesList.classList.add('show');
        } catch (error) {
            console.log('加载愿望失败:', error);
            wishesList.innerHTML = '<p style="text-align: center; color: #ff69b4; font-family: \'Caveat\', cursive; font-size: 1.2rem;">加载愿望失败，请稍后重试</p>';
            savedWishesList.classList.add('show');
        }
    }
    
    // 关闭愿望列表
    function closeSavedWishes() {
        if (savedWishesList) {
            savedWishesList.classList.remove('show');
        }
    }
    
    // 事件监听
    if (wishInput) {
        wishInput.addEventListener('input', updateWishCount);
        wishInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleWishSubmit();
            }
        });
    }
    
    if (wishSubmit) {
        wishSubmit.addEventListener('click', handleWishSubmit);
    }
    
    if (viewWishesBtn) {
        viewWishesBtn.addEventListener('click', showSavedWishes);
    }
    
    if (closeWishesBtn) {
        closeWishesBtn.addEventListener('click', closeSavedWishes);
    }
});

// 小爱心装饰
function initHearts() {
    const numberOfHearts = 25;
    const container = document.getElementById('mainContent');
    
    // 确保容器存在
    if (!container) {
        return;
    }
    
    for (let i = 0; i < numberOfHearts; i++) {
        createHeartDecoration(container);
    }
}

function createHeartDecoration(container) {
    // 确保容器存在
    if (!container) {
        return;
    }
    
    const heart = document.createElement('div');
    heart.className = 'heart-decoration';
    
    // 随机大小
    const size = Math.random() * 12 + 8;
    heart.style.width = size + 'px';
    heart.style.height = size + 'px';
    
    // 随机初始位置
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.top = Math.random() * 100 + 'vh';
    
    // 随机延迟
    const delay = Math.random() * 2;
    heart.style.animationDelay = delay + 's';
    
    container.appendChild(heart);
    
    // 爱心消失后重新创建
    setTimeout(function() {
        heart.remove();
        createHeartDecoration(container);
    }, (Math.random() * 3 + 2) * 1000);
}

// 蝴蝶结装饰
function initBows() {
    const numberOfBows = 12;
    const container = document.getElementById('mainContent');
    
    // 确保容器存在
    if (!container) {
        return;
    }
    
    for (let i = 0; i < numberOfBows; i++) {
        createBowDecoration(container);
    }
}

function createBowDecoration(container) {
    // 确保容器存在
    if (!container) {
        return;
    }
    
    const bow = document.createElement('div');
    bow.className = 'bow-decoration';
    
    // 随机初始位置
    bow.style.left = Math.random() * 100 + 'vw';
    bow.style.top = Math.random() * 100 + 'vh';
    
    // 随机延迟
    const delay = Math.random() * 3;
    bow.style.animationDelay = delay + 's';
    
    container.appendChild(bow);
    
    // 蝴蝶结消失后重新创建
    setTimeout(function() {
        bow.remove();
        createBowDecoration(container);
    }, (Math.random() * 4 + 3) * 1000);
}

// 小兔子装饰
function initRabbits() {
    const numberOfRabbits = 8;
    const container = document.getElementById('mainContent');
    
    // 确保容器存在
    if (!container) {
        return;
    }
    
    for (let i = 0; i < numberOfRabbits; i++) {
        createRabbitDecoration(container);
    }
}

function createRabbitDecoration(container) {
    // 确保容器存在
    if (!container) {
        return;
    }
    
    const rabbit = document.createElement('div');
    rabbit.className = 'rabbit-decoration';
    
    // 随机初始位置
    rabbit.style.left = Math.random() * 100 + 'vw';
    rabbit.style.top = Math.random() * 100 + 'vh';
    
    // 随机延迟
    const delay = Math.random() * 3;
    rabbit.style.animationDelay = delay + 's';
    
    container.appendChild(rabbit);
    
    // 小兔子消失后重新创建
    setTimeout(function() {
        rabbit.remove();
        createRabbitDecoration(container);
    }, (Math.random() * 5 + 3) * 1000);
}

// 小猫咪装饰
function initCats() {
    const numberOfCats = 8;
    const container = document.getElementById('mainContent');
    
    // 确保容器存在
    if (!container) {
        return;
    }
    
    for (let i = 0; i < numberOfCats; i++) {
        createCatDecoration(container);
    }
}

function createCatDecoration(container) {
    // 确保容器存在
    if (!container) {
        return;
    }
    
    const cat = document.createElement('div');
    cat.className = 'cat-decoration';
    
    // 随机初始位置
    cat.style.left = Math.random() * 100 + 'vw';
    cat.style.top = Math.random() * 100 + 'vh';
    
    // 随机延迟
    const delay = Math.random() * 4;
    cat.style.animationDelay = delay + 's';
    
    container.appendChild(cat);
    
    // 小猫咪消失后重新创建
    setTimeout(function() {
        cat.remove();
        createCatDecoration(container);
    }, (Math.random() * 6 + 4) * 1000);
}

// 气球装饰
function initBalloons() {
    const numberOfBalloons = 8;
    const container = document.getElementById('mainContent');
    
    // 确保容器存在
    if (!container) {
        return;
    }
    
    for (let i = 0; i < numberOfBalloons; i++) {
        createBalloonDecoration(container);
    }
}

function createBalloonDecoration(container) {
    // 确保容器存在
    if (!container) {
        return;
    }
    
    const balloon = document.createElement('div');
    balloon.className = 'balloon-decoration';
    
    // 随机初始位置 - 更广的分布范围
    balloon.style.left = Math.random() * 95 + 'vw';
    balloon.style.top = Math.random() * 110 + 'vh';
    
    // 随机颜色 - 增加更多粉色系颜色
    const colors = [
        'linear-gradient(135deg, #ff69b4 0%, #ff1493 100%)',
        'linear-gradient(135deg, #ffb6c1 0%, #ff8fab 100%)',
        'linear-gradient(135deg, #ffd6e0 0%, #ff9fc1 100%)',
        'linear-gradient(135deg, #ffc0cb 0%, #ff69b4 100%)',
        'linear-gradient(135deg, #ffb3ba 0%, #ff7a85 100%)',
        'linear-gradient(135deg, #ffccd5 0%, #ff8fab 100%)',
        'linear-gradient(135deg, #ffe4e1 0%, #ffb6c1 100%)',
        'linear-gradient(135deg, #fff0f5 0%, #ffd6e0 100%)',
        'linear-gradient(135deg, #ffe6fa 0%, #ffc0cb 100%)',
        'linear-gradient(135deg, #ffd1dc 0%, #ff9aa2 100%)'
    ];
    balloon.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    // 随机大小
    const size = Math.random() * 0.8 + 0.6;
    balloon.style.transform = `scale(${size})`;
    
    // 随机延迟
    const delay = Math.random() * 4;
    balloon.style.animationDelay = delay + 's';
    
    // 随机旋转角度
    const rotation = Math.random() * 20 - 10;
    balloon.style.transform += ` rotate(${rotation}deg)`;
    
    // 添加气球尾巴
    const tail = document.createElement('div');
    tail.style.position = 'absolute';
    tail.style.bottom = '-25px';
    tail.style.left = '50%';
    tail.style.transform = 'translateX(-50%) rotate(' + (Math.random() * 30 - 15) + 'deg)';
    tail.style.width = '2px';
    tail.style.height = '25px';
    tail.style.background = '#333';
    tail.style.opacity = '0.7';
    balloon.appendChild(tail);
    
    // 随机添加可爱表情
    const hasFace = Math.random() > 0.7;
    if (hasFace) {
        const face = document.createElement('div');
        face.style.position = 'absolute';
        face.style.top = '50%';
        face.style.left = '50%';
        face.style.transform = 'translate(-50%, -50%)';
        face.style.fontSize = (size * 20) + 'px';
        face.style.color = 'white';
        face.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
        
        const faces = ['😊', '😍', '🥰', '😘', '😚', '😙'];
        face.textContent = faces[Math.floor(Math.random() * faces.length)];
        balloon.appendChild(face);
    }
    
    // 随机添加装饰星星
    const hasStar = Math.random() > 0.6;
    if (hasStar) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.top = (Math.random() * 30) + 'px';
        star.style.left = (Math.random() * 30) + 'px';
        star.style.fontSize = (size * 12) + 'px';
        star.textContent = '⭐';
        star.style.animation = 'twinkle 1.5s infinite';
        balloon.appendChild(star);
    }
    
    container.appendChild(balloon);
    
    // 气球消失后重新创建
    setTimeout(function() {
        balloon.remove();
        createBalloonDecoration(container);
    }, (Math.random() * 10 + 8) * 1000);
}

// 彩虹装饰
function initRainbows() {
    const numberOfRainbows = 5;
    const container = document.getElementById('mainContent');
    
    // 确保容器存在
    if (!container) {
        return;
    }
    
    for (let i = 0; i < numberOfRainbows; i++) {
        createRainbowDecoration(container);
    }
}

function createRainbowDecoration(container) {
    // 确保容器存在
    if (!container) {
        return;
    }
    
    const rainbow = document.createElement('div');
    rainbow.className = 'rainbow-decoration';
    
    // 随机初始位置 - 更广的分布范围，包括底部区域
    rainbow.style.left = Math.random() * 90 + 'vw';
    rainbow.style.top = Math.random() * 80 + 'vh';
    
    // 随机大小 - 更大的变化范围
    const size = Math.random() * 1.2 + 0.3;
    rainbow.style.transform = `scale(${size})`;
    
    // 随机延迟
    const delay = Math.random() * 8;
    rainbow.style.animationDelay = delay + 's';
    
    // 随机旋转角度 - 更大的变化范围
    const rotation = Math.random() * 60 - 30;
    rainbow.style.transform += ` rotate(${rotation}deg)`;
    
    // 增强发光效果，添加颜色变化
    const glowColors = ['rgba(255, 210, 255, 0.8)', 'rgba(255, 180, 220, 0.8)', 'rgba(255, 220, 255, 0.8)', 'rgba(255, 200, 230, 0.8)'];
    const glowColor = glowColors[Math.floor(Math.random() * glowColors.length)];
    const glowSize = Math.random() * 15 + 8;
    rainbow.style.filter = `drop-shadow(0 0 ${glowSize}px ${glowColor}) blur(2px)`;
    
    // 随机添加星星装饰
    const hasStars = Math.random() > 0.6;
    if (hasStars) {
        const starCount = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.style.position = 'absolute';
            star.style.top = Math.random() * 60 + 'px';
            star.style.left = Math.random() * 60 + 'px';
            star.style.fontSize = (Math.random() * 12 + 8) + 'px';
            star.textContent = '⭐';
            star.style.animation = 'twinkle 1.5s infinite';
            star.style.transform = `rotate(${Math.random() * 360}deg)`;
            rainbow.appendChild(star);
        }
    }
    
    // 随机添加爱心装饰
    const hasHearts = Math.random() > 0.7;
    if (hasHearts) {
        const heartCount = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < heartCount; i++) {
            const heart = document.createElement('div');
            heart.style.position = 'absolute';
            heart.style.top = Math.random() * 60 + 'px';
            heart.style.left = Math.random() * 60 + 'px';
            heart.style.fontSize = (Math.random() * 10 + 6) + 'px';
            heart.textContent = '💖';
            heart.style.animation = 'floatHeart 2s ease-in-out infinite';
            heart.style.transform = `rotate(${Math.random() * 360}deg)`;
            rainbow.appendChild(heart);
        }
    }
    
    container.appendChild(rainbow);
    
    // 彩虹消失后重新创建
    setTimeout(function() {
        rainbow.remove();
        createRainbowDecoration(container);
    }, (Math.random() * 15 + 12) * 1000);
}

// 花朵装饰
function initFlowers() {
    const numberOfFlowers = 8;
    const container = document.getElementById('mainContent');
    
    // 确保容器存在
    if (!container) {
        return;
    }
    
    for (let i = 0; i < numberOfFlowers; i++) {
        createFlowerDecoration(container);
    }
}

function createFlowerDecoration(container) {
    // 确保容器存在
    if (!container) {
        return;
    }
    
    const flower = document.createElement('div');
    flower.className = 'flower-decoration';
    
    // 随机初始位置
    flower.style.left = Math.random() * 95 + 'vw';
    flower.style.top = Math.random() * 95 + 'vh';
    
    // 随机花型 - 增加更多种类
    const flowers = ['🌸', '🌺', '🌼', '🌻', '🌹', '💐', '🌷', '🥀', '🌱', '🌿'];
    const emoji = flowers[Math.floor(Math.random() * flowers.length)];
    flower.innerHTML = emoji;
    
    // 随机大小
    const size = Math.random() * 1.2 + 0.8;
    flower.style.transform = `scale(${size})`;
    
    // 随机延迟
    const delay = Math.random() * 3;
    flower.style.animationDelay = delay + 's';
    
    // 随机旋转角度
    const rotation = Math.random() * 360;
    flower.style.transform += ` rotate(${rotation}deg)`;
    
    // 随机添加发光效果
    const hasGlow = Math.random() > 0.6;
    if (hasGlow) {
        const colors = ['#ffb6c1', '#ff69b4', '#ffd6e0', '#ffc0cb'];
        const glowColor = colors[Math.floor(Math.random() * colors.length)];
        flower.style.filter = `drop-shadow(0 0 ${Math.random() * 10 + 5}px ${glowColor})`;
    }
    
    // 随机添加花瓣飘落效果
    const hasPetals = Math.random() > 0.5;
    if (hasPetals) {
        setTimeout(() => {
            createPetals(flower);
        }, Math.random() * 3000);
    }
    
    container.appendChild(flower);
    
    // 花朵消失后重新创建
    setTimeout(function() {
        flower.remove();
        createFlowerDecoration(container);
    }, (Math.random() * 8 + 5) * 1000);
}

// 创建花瓣飘落效果
function createPetals(flowerElement) {
    const container = flowerElement.parentNode;
    const flowerRect = flowerElement.getBoundingClientRect();
    const petalCount = Math.floor(Math.random() * 5) + 3;
    
    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement('div');
        petal.style.position = 'absolute';
        petal.style.left = (flowerRect.left + window.scrollX + flowerRect.width / 2) + 'px';
        petal.style.top = (flowerRect.top + window.scrollY + flowerRect.height / 2) + 'px';
        petal.style.fontSize = '12px';
        petal.style.opacity = '0.8';
        petal.style.pointerEvents = 'none';
        petal.style.zIndex = '9998';
        
        // 随机花瓣类型
        const petals = ['🍃', '🌿', '🍂'];
        petal.textContent = petals[Math.floor(Math.random() * petals.length)];
        
        // 随机动画参数
        const duration = Math.random() * 3 + 2;
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100 + 50;
        
        petal.style.animation = `petalFall ${duration}s ease-out forwards`;
        petal.style.transform = `translate(0, 0) rotate(0deg)`;
        
        // 动态生成花瓣动画
        if (i === 0) {
            const style = document.createElement('style');
            style.textContent = `
                @keyframes petalFall {
                    0% {
                        transform: translate(0, 0) rotate(0deg) scale(1);
                        opacity: 0.8;
                    }
                    100% {
                        transform: translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance + 100}px) rotate(360deg) scale(0);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
            
            setTimeout(() => {
                style.remove();
            }, duration * 1000);
        }
        
        container.appendChild(petal);
        
        // 清理花瓣
        setTimeout(() => {
            petal.remove();
        }, duration * 1000);
    }
}

// 云朵装饰
function initClouds() {
    const numberOfClouds = 6;
    const container = document.getElementById('mainContent');
    
    // 确保容器存在
    if (!container) {
        return;
    }
    
    for (let i = 0; i < numberOfClouds; i++) {
        createCloudDecoration(container);
    }
}

function createCloudDecoration(container) {
    // 确保容器存在
    if (!container) {
        return;
    }
    
    const cloud = document.createElement('div');
    cloud.className = 'cloud-decoration';
    
    // 随机初始位置 - 扩大分布范围
    cloud.style.left = Math.random() * 100 + 'vw';
    cloud.style.top = Math.random() * 60 + 'vh';
    
    // 随机大小 - 更大的变化范围
    const size = Math.random() * 0.8 + 0.5;
    cloud.style.transform = `scale(${size})`;
    
    // 随机延迟
    const delay = Math.random() * 8;
    cloud.style.animationDelay = delay + 's';
    
    // 随机旋转角度
    const rotation = Math.random() * 20 - 10;
    cloud.style.transform += ` rotate(${rotation}deg)`;
    
    // 添加可爱表情装饰
    const hasFace = Math.random() > 0.5;
    if (hasFace) {
        const face = document.createElement('div');
        face.style.position = 'absolute';
        face.style.top = '50%';
        face.style.left = '50%';
        face.style.transform = 'translate(-50%, -50%)';
        
        // 随机表情
        const faces = ['😊', '🥰', '😍', '😘', '😇', '🌟', '✨'];
        const emoji = faces[Math.floor(Math.random() * faces.length)];
        face.textContent = emoji;
        face.style.fontSize = (Math.random() * 15 + 12) + 'px';
        face.style.zIndex = '10';
        
        cloud.appendChild(face);
    }
    
    // 添加星星装饰
    const hasStars = Math.random() > 0.4;
    if (hasStars) {
        const starCount = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.style.position = 'absolute';
            star.style.top = Math.random() * 80 + 'px';
            star.style.left = Math.random() * 80 + 'px';
            star.style.fontSize = (Math.random() * 8 + 6) + 'px';
            star.textContent = '⭐';
            star.style.animation = 'twinkle 1.5s infinite';
            star.style.transform = `rotate(${Math.random() * 360}deg)`;
            cloud.appendChild(star);
        }
    }
    
    // 添加爱心装饰
    const hasHearts = Math.random() > 0.3;
    if (hasHearts) {
        const heart = document.createElement('div');
        heart.style.position = 'absolute';
        heart.style.top = Math.random() * 60 + 'px';
        heart.style.left = Math.random() * 60 + 'px';
        heart.style.fontSize = (Math.random() * 10 + 8) + 'px';
        heart.textContent = '💖';
        heart.style.animation = 'heartBeat 2s infinite';
        heart.style.transform = `rotate(${Math.random() * 360}deg)`;
        cloud.appendChild(heart);
    }
    
    container.appendChild(cloud);
    
    // 云朵消失后重新创建
    setTimeout(function() {
        cloud.remove();
        createCloudDecoration(container);
    }, (Math.random() * 15 + 12) * 1000);
}

// 动态粒子效果
function initParticles() {
    const numberOfParticles = 20;
    
    // 初始创建一批粒子
    for (let i = 0; i < numberOfParticles; i++) {
        setTimeout(() => {
            createParticle();
        }, i * 100);
    }
    
    // 定期创建新粒子
    setInterval(() => {
        createParticle();
    }, 300);
}

function createParticle() {
    const particle = document.createElement('div');
    
    // 随机选择粒子类型 - 增加更多可爱类型
    const particleTypes = ['particle', 'particle-heart', 'particle-star', 'particle-flower', 'particle-heart-small', 'particle-circle', 'particle-sparkle'];
    const randomType = particleTypes[Math.floor(Math.random() * particleTypes.length)];
    particle.className = randomType;
    
    // 随机初始位置 - 增加水平分布的随机性
    const randomX = Math.random() * 100;
    particle.style.left = randomX + 'vw';
    particle.style.top = '100vh';
    
    // 随机大小 - 更大的变化范围
    const size = Math.random() * 1.5 + 0.3;
    particle.style.transform = `scale(${size})`;
    
    // 随机动画延迟
    const delay = Math.random() * 4;
    particle.style.animationDelay = delay + 's';
    
    // 随机动画持续时间 - 更丰富的变化
    const duration = Math.random() * 8 + 4;
    particle.style.animationDuration = duration + 's';
    
    // 随机不透明度
    particle.style.opacity = Math.random() * 0.8 + 0.2;
    
    // 随机颜色 - 为基础粒子添加更多颜色变化
    if (randomType === 'particle') {
        const colors = ['#ff69b4', '#ffb6c1', '#ffc0cb', '#ff8fab', '#ff1493', '#c71585', '#db7093'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = randomColor;
    }
    
    // 添加发光效果
    if (Math.random() > 0.7) {
        const glowColors = ['rgba(255, 105, 180, 0.8)', 'rgba(255, 215, 0, 0.8)', 'rgba(255, 182, 193, 0.8)'];
        const glowColor = glowColors[Math.floor(Math.random() * glowColors.length)];
        particle.style.boxShadow = `0 0 ${Math.random() * 6 + 3}px ${glowColor}`;
    }
    
    // 添加旋转效果
    const rotation = Math.random() * 360;
    particle.style.transform += ` rotate(${rotation}deg)`;
    
    document.body.appendChild(particle);
    
    // 粒子消失后移除
    setTimeout(() => {
        if (particle.parentNode) {
            particle.remove();
        }
    }, (duration + delay) * 1000);
}