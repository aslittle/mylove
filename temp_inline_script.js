// 照片上传功能
document.addEventListener('DOMContentLoaded', function() {
    const photoFileInput = document.getElementById('photoFile');
    const previewImage = document.getElementById('previewImage');
    const photoPreview = document.getElementById('photoPreview');
    const photoUploadForm = document.getElementById('photoUploadForm');

    // 照片预览
    photoFileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                photoPreview.classList.add('show');
            };
            reader.readAsDataURL(file);
        } else {
            photoPreview.classList.remove('show');
        }
    });

    // 表单提交
    photoUploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const photoTitle = document.getElementById('photoTitle').value.trim();
        const photoDescription = document.getElementById('photoDescription').value.trim();
        const photoFile = photoFileInput.files[0];

        if (!photoTitle || !photoFile) {
            alert('请填写照片标题并选择照片！');
            return;
        }

        const reader = new FileReader();

        reader.onload = function(e) {
            const photoData = {
                id: Date.now(),
                title: photoTitle,
                description: photoDescription,
                image: e.target.result,
                timestamp: new Date().toISOString()
            };

            // 保存到localStorage
            saveToLocalStorage('happyPhotos', photoData);
            
            // 清空表单
            photoUploadForm.reset();
            photoPreview.classList.remove('show');
            
            // 刷新相册显示
            loadPhotos();
            
            // 显示成功消息
            showSuccessMessage('照片上传成功！');
        };

        reader.readAsDataURL(photoFile);
    });

    // 保存到localStorage
    function saveToLocalStorage(key, data) {
        try {
            const savedData = JSON.parse(localStorage.getItem(key) || '[]');
            savedData.push(data);
            localStorage.setItem(key, JSON.stringify(savedData));
        } catch (error) {
            console.error('保存失败:', error);
            alert('保存失败，请稍后重试！');
        }
    }

    // 显示成功消息
    function showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        document.body.appendChild(successDiv);
        
        // 添加CSS样式
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        
        // 添加动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
        
        // 3秒后移除
        setTimeout(() => {
            successDiv.remove();
            style.remove();
        }, 3000);
    }

    // 加载照片到相册
    function loadPhotos() {
        const gallery = document.querySelector('.gallery.album-gallery');
        const savedPhotos = JSON.parse(localStorage.getItem('happyPhotos') || '[]');
        
        // 清空现有照片
        gallery.innerHTML = '';
        
        // 显示默认照片
        const defaultPhotos = [
            "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&h=300&fit=crop",
            "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop",
            "https://images.unsplash.com/photo-1567529837169-97a204c231e4?w=300&h=300&fit=crop",
            "https://images.unsplash.com/photo-1582791698869-0c0a54315c63?w=300&h=300&fit=crop",
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop",
            "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&h=300&fit=crop",
            "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&h=300&fit=crop",
            "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300&h=300&fit=crop",
            "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=300&h=300&fit=crop",
            "https://images.unsplash.com/photo-1504253163759-2f6a4303b3f6?w=300&h=300&fit=crop"
        ];
        
        // 显示默认照片
        defaultPhotos.forEach((imgSrc, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.setAttribute('data-img', imgSrc);
            galleryItem.innerHTML = `
                <div class="gallery-overlay">
                    <i class="fas fa-heart"></i>
                </div>
            `;
            gallery.appendChild(galleryItem);
        });
        
        // 添加用户上传的照片
        savedPhotos.forEach(photo => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.setAttribute('data-img', photo.image);
            galleryItem.setAttribute('data-title', photo.title);
            galleryItem.setAttribute('data-description', photo.description);
            galleryItem.innerHTML = `
                <div class="gallery-overlay">
                    <i class="fas fa-heart"></i>
                </div>
            `;
            gallery.appendChild(galleryItem);
        });
        
        // 重新绑定点击事件
        bindGalleryClickEvents();
    }

    // 绑定相册点击事件
    function bindGalleryClickEvents() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const imageViewer = document.getElementById('imageViewer');
        const viewerImage = document.getElementById('viewerImage');
        const caption = document.getElementById('caption');
        const closeBtn = document.querySelector('.close');

        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const imgSrc = this.getAttribute('data-img');
                const imgTitle = this.getAttribute('data-title');
                const imgDesc = this.getAttribute('data-description');
                
                viewerImage.src = imgSrc;
                caption.innerHTML = imgTitle ? `${imgTitle} - ${imgDesc || ''}` : '';
                imageViewer.classList.add('show');
                imageViewer.style.display = 'block';
            });
        });

        closeBtn.addEventListener('click', function() {
            imageViewer.classList.remove('show');
            setTimeout(() => {
                imageViewer.style.display = 'none';
            }, 800);
        });

        window.addEventListener('click', function(e) {
            if (e.target === imageViewer) {
                imageViewer.classList.remove('show');
                setTimeout(() => {
                    imageViewer.style.display = 'none';
                }, 800);
            }
        });
    }

    // 初始加载照片
    loadPhotos();
});