// ================================
// Project HAKIMI: 混沌与救赎
// 全栈交互逻辑
// ================================

// TODO: 用户需要替换的链接常量
const VIDEO_LINKS = {
    VIDEO_HACHIMI: 'https://www.youtube.com/embed/YOUR_VIDEO_ID_1',
    VIDEO_CUTE: 'https://www.youtube.com/embed/YOUR_VIDEO_ID_2',
    VIDEO_MAODIEJ: 'https://www.youtube.com/embed/YOUR_VIDEO_ID_3'
};

const PRODUCT_LINK = 'https://example.com/buy';  // TODO: 替换为实际购买链接

// ================================
// 全局状态管理
// ================================
const AppState = {
    currentSection: 'genesis',
    stockGame: null,
    bossGame: null
};

// ================================
// 导航功能
// ================================
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // 移动端菜单切换
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // 平滑滚动
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const section = link.getAttribute('data-section');
            if (section) {
                AppState.currentSection = section;
            }
            // 移动端关闭菜单
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });
}

// ================================
// Modal 弹窗系统
// ================================
function initModals() {
    const videoModal = document.getElementById('video-modal');
    const videoFrame = document.getElementById('video-frame');
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');

    // 原典回溯按钮
    document.querySelectorAll('.btn-original').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const videoKey = btn.getAttribute('data-video');
            const videoUrl = VIDEO_LINKS[videoKey] || 'about:blank';
            if (videoFrame && videoModal) {
                videoFrame.src = videoUrl;
                videoModal.classList.add('show');
            }
        });
    });

    // 图片查看
    document.querySelectorAll('.gallery-item').forEach(function(item) {
        item.addEventListener('click', function() {
            const imgSrc = item.getAttribute('data-src');
            if (modalImage && imageModal) {
                modalImage.src = imgSrc;
                imageModal.classList.add('show');
            }
        });
    });

    // 关闭按钮
    document.querySelectorAll('.modal-close').forEach(function(closeBtn) {
        closeBtn.addEventListener('click', function() {
            if (videoModal) videoModal.classList.remove('show');
            if (imageModal) imageModal.classList.remove('show');
            if (videoFrame) videoFrame.src = '';
        });
    });

    // 点击背景关闭
    [videoModal, imageModal].forEach(function(modal) {
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.classList.remove('show');
                    if (videoFrame) videoFrame.src = '';
                }
            });
        }
    });
}

// ================================
// 表情包搜索功能
// ================================
function initGallerySearch() {
    const archiveSection = document.querySelector('.section-archive');
    const galleryContainer = document.querySelector('.gallery-container');

    if (!archiveSection || !galleryContainer) return;

    const searchButtons = document.createElement('div');
    searchButtons.className = 'search-buttons';
    searchButtons.innerHTML = '<button class="btn-search btn-bilibili" onclick="searchBilibili()">🎬 B站搜索耄耋</button>' +
        '<button class="btn-search btn-edge" onclick="searchEdgeImages()">🖼️ 图片搜索耄耋</button>' +
        '<button class="btn-search btn-baidu" onclick="searchBaiduImages()">📷 百度图片搜索</button>';

    galleryContainer.parentNode.insertBefore(searchButtons, galleryContainer);
}

function searchBilibili() {
    window.open('https://search.bilibili.com/all?keyword=' + encodeURIComponent('耄耋'), '_blank');
}

function searchEdgeImages() {
    window.open('https://www.bing.com/images/search?q=' + encodeURIComponent('耄耋 表情包'), '_blank');
}

function searchBaiduImages() {
    window.open('https://image.baidu.com/search/index?tn=baiduimage&word=' + encodeURIComponent('耄耋表情包'), '_blank');
}

// ================================
// A股操盘手游戏
// ================================
function StockGame() {
    this.money = 100000;
    this.stockPrice = 88.88;
    this.emotion = 50;
    this.priceHistory = [88.88];
    this.events = [
        { text: '谣言：九阳收购猫粮厂', correct: '加仓', impact: 15 },
        { text: '突发：耄耋咬人视频流出', correct: '跑路', impact: -20 },
        { text: '官方辟谣：九阳与猫无关', correct: '跑路', impact: -10 },
        { text: '明星代言：某网红推荐九阳', correct: '加仓', impact: 12 },
        { text: '财报发布：九阳利润暴跌', correct: '跑路', impact: -25 },
        { text: '散户狂热：论坛疯传内幕', correct: '跑路', impact: -15 },
        { text: '机构护盘：大资金入场', correct: '加仓', impact: 18 },
        { text: '监管介入：调查迷因营销', correct: '跑路', impact: -30 }
    ];
    this.eventTimer = null;
    this.canvas = document.getElementById('chart-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.isPlaying = false;
    this.init();
}

StockGame.prototype.init = function() {
    if (!this.canvas) return;
    var self = this;
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;

    var buyBtn = document.getElementById('btn-buy-stock');
    var sellBtn = document.getElementById('btn-sell-stock');

    if (buyBtn) buyBtn.addEventListener('click', function() { self.trade('加仓'); });
    if (sellBtn) sellBtn.addEventListener('click', function() { self.trade('跑路'); });

    this.isPlaying = true;
    this.updateUI();
    this.drawChart();
    this.startEventLoop();
    this.startPriceFluctuation();
};

StockGame.prototype.trade = function(action) {
    if (!this.isPlaying) return;
    var changePercent = (Math.random() * 10 - 5).toFixed(2);
    var oldPrice = this.stockPrice;

    if (action === '加仓') {
        this.emotion = Math.min(100, this.emotion + 10);
        this.stockPrice += this.stockPrice * (changePercent / 100);
    } else {
        this.emotion = Math.max(0, this.emotion - 10);
        this.stockPrice -= this.stockPrice * (Math.abs(changePercent) / 100);
    }

    this.money += (this.stockPrice - oldPrice) * 100;
    this.priceHistory.push(this.stockPrice);
    if (this.priceHistory.length > 50) this.priceHistory.shift();

    this.updateUI();
    this.drawChart();
    this.checkGameOver();
};

StockGame.prototype.startEventLoop = function() {
    var self = this;
    var triggerEvent = function() {
        if (!self.isPlaying) return;
        var event = self.events[Math.floor(Math.random() * self.events.length)];
        self.showEventCard(event);
        self.eventTimer = setTimeout(triggerEvent, 8000 + Math.random() * 7000);
    };
    this.eventTimer = setTimeout(triggerEvent, 5000);
};

StockGame.prototype.showEventCard = function(event) {
    var self = this;
    var eventCard = document.getElementById('event-card');
    var eventContent = document.getElementById('event-content');
    var eventTimer = document.getElementById('event-timer');

    if (!eventCard || !eventContent || !eventTimer) return;

    eventContent.textContent = event.text;
    eventCard.style.display = 'block';

    var countdown = 3;
    eventTimer.textContent = countdown;

    var countdownInterval = setInterval(function() {
        countdown--;
        eventTimer.textContent = countdown;
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            eventCard.style.display = 'none';
        }
    }, 1000);

    document.querySelectorAll('.btn-event').forEach(function(btn) {
        btn.onclick = function() {
            clearInterval(countdownInterval);
            self.handleEventChoice(btn.getAttribute('data-action'), event);
            eventCard.style.display = 'none';
        };
    });
};

StockGame.prototype.handleEventChoice = function(action, event) {
    if (action === event.correct) {
        this.stockPrice += this.stockPrice * (Math.abs(event.impact) / 100);
        this.money += Math.abs(event.impact) * 1000;
    } else {
        this.stockPrice -= this.stockPrice * (Math.abs(event.impact) / 100);
        this.money -= Math.abs(event.impact) * 1000;
    }
    this.priceHistory.push(this.stockPrice);
    this.updateUI();
    this.drawChart();
    this.checkGameOver();
};

StockGame.prototype.startPriceFluctuation = function() {
    var self = this;
    setInterval(function() {
        if (!self.isPlaying) return;
        var emotionFactor = (self.emotion - 50) / 100;
        var change = ((Math.random() - 0.5) * 2 + emotionFactor) * 0.5;
        self.stockPrice += self.stockPrice * (change / 100);
        self.priceHistory.push(self.stockPrice);
        if (self.priceHistory.length > 50) self.priceHistory.shift();
        self.updateUI();
        self.drawChart();
    }, 2000);
};

StockGame.prototype.updateUI = function() {
    var moneyEl = document.getElementById('stock-money');
    var priceEl = document.getElementById('stock-price');
    var changeEl = document.getElementById('stock-change');
    var emotionFill = document.getElementById('emotion-fill');

    if (moneyEl) moneyEl.textContent = '¥' + Math.floor(this.money).toLocaleString();
    if (priceEl) priceEl.textContent = '¥' + this.stockPrice.toFixed(2);

    if (changeEl) {
        var change = ((this.stockPrice - 88.88) / 88.88 * 100).toFixed(2);
        changeEl.textContent = (change > 0 ? '+' : '') + change + '%';
        changeEl.style.color = change > 0 ? '#B5E61D' : '#FF0055';
    }

    if (emotionFill) emotionFill.style.width = this.emotion + '%';
};

StockGame.prototype.drawChart = function() {
    if (!this.ctx) return;
    var ctx = this.ctx;
    var width = this.canvas.width;
    var height = this.canvas.height;

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(181, 230, 29, 0.1)';
    ctx.lineWidth = 1;
    for (var i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(0, (height / 4) * i);
        ctx.lineTo(width, (height / 4) * i);
        ctx.stroke();
    }

    if (this.priceHistory.length < 2) return;

    var maxPrice = Math.max.apply(Math, this.priceHistory);
    var minPrice = Math.min.apply(Math, this.priceHistory);
    var priceRange = maxPrice - minPrice || 1;

    ctx.strokeStyle = '#B5E61D';
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (var i = 0; i < this.priceHistory.length; i++) {
        var x = (width / (this.priceHistory.length - 1)) * i;
        var y = height - ((this.priceHistory[i] - minPrice) / priceRange) * height;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }

    ctx.stroke();
    ctx.shadowColor = '#B5E61D';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;
};

StockGame.prototype.checkGameOver = function() {
    if (this.money <= 0) {
        this.isPlaying = false;
        clearTimeout(this.eventTimer);
        this.showCrashModal();
    }
};

StockGame.prototype.showCrashModal = function() {
    var self = this;
    var crashModal = document.getElementById('crash-modal');
    if (crashModal) {
        crashModal.style.display = 'flex';
        setTimeout(function() {
            window.open(PRODUCT_LINK, '_blank');
            crashModal.style.display = 'none';
            self.money = 100000;
            self.stockPrice = 88.88;
            self.emotion = 50;
            self.priceHistory = [88.88];
            self.isPlaying = true;
            self.updateUI();
            self.drawChart();
            self.startEventLoop();
        }, 2000);
    }
};

// Boss Game略 - 保持简洁
function BossGame() {
    this.bossHP = 1000;
    this.bossMaxHP = 1000;
    this.playerHP = 100;
    this.playerMaxHP = 100;
    this.rage = 0;
    this.bossState = 'idle';
    this.isPlayerTurn = true;
    this.bossNextMove = null;
    this.isDefending = false;
    this.bossSprite = document.getElementById('boss-sprite');
    this.battleLog = document.getElementById('battle-log');
    this.bossImages = {
        idle: 'assets/boss_idle.png',
        red_eye: 'assets/boss_red_eye.png',
        hiss: 'assets/boss_hiss.png',
        ko: 'assets/boss_ko.png'
    };
    this.init();
}

BossGame.prototype.init = function() {
    var self = this;
    document.querySelectorAll('.btn-action').forEach(function(btn) {
        btn.addEventListener('click', function() {
            self.playerAction(btn.getAttribute('data-action'));
        });
    });
    this.updateUI();
    this.predictBossMove();
    this.addLog('战斗开始！耄耋正在观察你的弱点...');
};

BossGame.prototype.playerAction = function(action) {
    if (!this.isPlayerTurn) return;
    this.isPlayerTurn = false;

    switch(action) {
        case 'attack': this.handleAttack(); break;
        case 'defend': this.handleDefend(); break;
        case 'charge': this.handleCharge(); break;
        case 'taunt': this.handleTaunt(); break;
        case 'ultimate': this.handleUltimate(); break;
    }

    this.updateUI();
    var self = this;
    setTimeout(function() { self.bossAction(); }, 1500);
};

BossGame.prototype.handleAttack = function() {
    var damage = 50 + Math.floor(Math.random() * 30);
    if (this.bossNextMove === 'hiss') {
        this.playerHP -= damage * 0.5;
        this.addLog('你发起攻击，但耄耋反弹了你的伤害！受到 ' + Math.floor(damage * 0.5) + ' 点反伤！');
    } else {
        this.bossHP -= damage;
        this.rage = Math.min(3, this.rage + 1);
        this.addLog('你攻击了耄耋，造成 ' + damage + ' 点伤害！');
    }
};

BossGame.prototype.handleDefend = function() {
    this.addLog('你进入防御姿态，减免50%伤害！');
    this.isDefending = true;
};

BossGame.prototype.handleCharge = function() {
    this.rage = Math.min(3, this.rage + 2);
    this.addLog('你进行蓄力，获得 2 点怒气！当前怒气：' + this.rage + '/3');
};

BossGame.prototype.handleTaunt = function() {
    this.addLog('你嘲讽了耄耋，它变得更加愤怒！');
};

BossGame.prototype.handleUltimate = function() {
    if (this.rage < 3) return;
    var damage = 300;
    this.bossHP -= damage;
    this.rage = 0;
    this.addLog('🫘 绿豆净化！你对耄耋造成 ' + damage + ' 点巨额伤害！');
};

BossGame.prototype.bossAction = function() {
    if (this.bossHP <= 0) {
        this.victory();
        return;
    }
    this.executeBossMove();
    this.predictBossMove();
    this.updateUI();
    if (this.playerHP <= 0) {
        this.defeat();
        return;
    }
    this.isPlayerTurn = true;
};

BossGame.prototype.executeBossMove = function() {
    switch(this.bossNextMove) {
        case 'red_eye':
            var damage = 50;
            if (this.isDefending) {
                // 完全格挡！
                this.addLog('耄耋眼睛发出红光，使用重拳！你成功格挡了全部伤害！');
            } else {
                this.playerHP -= damage;
                this.addLog('耄耋眼睛发出红光，使用重拳！造成 ' + damage + ' 点伤害！');
            }
            this.isDefending = false;
            break;
        case 'hiss':
            this.addLog('耄耋发出哈气声，进入反击姿态！');
            break;
        case 'idle':
            this.addLog('耄耋在舔毛，露出破绽！这是攻击的好机会！');
            break;
    }
    this.isDefending = false;
};

BossGame.prototype.predictBossMove = function() {
    var moves = ['red_eye', 'hiss', 'idle'];
    this.bossNextMove = moves[Math.floor(Math.random() * moves.length)];
    this.setBossState(this.bossNextMove);
    var statusText = {
        red_eye: '⚠️ 耄耋眼睛发红！准备使用重拳！',
        hiss: '⚠️ 耄耋身体后仰哈气，准备反击！',
        idle: '✓ 耄耋在舔毛，露出破绽！'
    };
    var statusEl = document.getElementById('boss-status');
    if (statusEl) statusEl.textContent = statusText[this.bossNextMove];
};

BossGame.prototype.setBossState = function(state) {
    this.bossState = state;
    if (this.bossSprite) this.bossSprite.src = this.bossImages[state];
};

BossGame.prototype.updateUI = function() {
    var bossHPBar = document.getElementById('boss-hp');
    var bossHPText = document.getElementById('boss-hp-text');
    var playerHPBar = document.getElementById('player-hp');
    var playerHPText = document.getElementById('player-hp-text');

    if (bossHPBar) bossHPBar.style.width = Math.max(0, (this.bossHP / this.bossMaxHP) * 100) + '%';
    if (bossHPText) bossHPText.textContent = Math.max(0, Math.floor(this.bossHP));
    if (playerHPBar) playerHPBar.style.width = Math.max(0, (this.playerHP / this.playerMaxHP) * 100) + '%';
    if (playerHPText) playerHPText.textContent = Math.max(0, Math.floor(this.playerHP)) + '/' + this.playerMaxHP;

    var self = this;
    document.querySelectorAll('.rage-slot').forEach(function(slot, index) {
        index < self.rage ? slot.classList.add('active') : slot.classList.remove('active');
    });

    var ultimateBtn = document.querySelector('.btn-ultimate');
    if (ultimateBtn) ultimateBtn.disabled = this.rage < 3;
};

BossGame.prototype.addLog = function(message) {
    if (!this.battleLog) return;
    var p = document.createElement('p');
    p.textContent = '> ' + message;
    this.battleLog.appendChild(p);
    this.battleLog.scrollTop = this.battleLog.scrollHeight;
};

BossGame.prototype.victory = function() {
    this.setBossState('ko');
    this.addLog('🎉 胜利！你成功击败了耄耋！');
    var statusEl = document.getElementById('boss-status');
    if (statusEl) statusEl.textContent = '✓ 胜利！耄耋被击败！';
    document.querySelectorAll('.btn-action').forEach(function(btn) {
        btn.disabled = true;
    });
};

BossGame.prototype.defeat = function() {
    this.addLog('💔 你被击败了！血压飙升！');
    this.showDefeatModal();
};

BossGame.prototype.showDefeatModal = function() {
    var self = this;
    var defeatModal = document.getElementById('defeat-modal');
    if (defeatModal) {
        defeatModal.style.display = 'flex';
        setTimeout(function() {
            window.open(PRODUCT_LINK, '_blank');
            defeatModal.style.display = 'none';
            self.resetGame();
        }, 2000);
    }
};

BossGame.prototype.resetGame = function() {
    this.bossHP = this.bossMaxHP;
    this.playerHP = this.playerMaxHP;
    this.rage = 0;
    this.isPlayerTurn = true;
    if (this.battleLog) this.battleLog.innerHTML = '<p>战斗重新开始！</p>';
    document.querySelectorAll('.btn-action').forEach(function(btn) {
        btn.disabled = false;
    });
    this.updateUI();
    this.predictBossMove();
};

// 数据可视化
function initDataViz() {
    var radarCanvas = document.getElementById('radar-chart');
    if (radarCanvas) drawRadarChart(radarCanvas);
    var barCanvas = document.getElementById('bar-chart');
    if (barCanvas) drawBarChart(barCanvas);
}

function drawRadarChart(canvas) {
    var ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 400;
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var radius = 150;
    var labels = ['迷因传播', '购买意愿', '社交分享', '品牌认知', '情绪波动'];
    var data1 = [90, 30, 85, 40, 95];
    var data2 = [20, 95, 30, 85, 40];

    ctx.strokeStyle = 'rgba(181, 230, 29, 0.3)';
    ctx.lineWidth = 1;
    for (var i = 1; i <= 5; i++) {
        ctx.beginPath();
        var r = (radius / 5) * i;
        for (var j = 0; j <= labels.length; j++) {
            var angle = (Math.PI * 2 / labels.length) * j - Math.PI / 2;
            var x = centerX + Math.cos(angle) * r;
            var y = centerY + Math.sin(angle) * r;
            j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '14px Courier New';
    ctx.textAlign = 'center';

    for (var i = 0; i < labels.length; i++) {
        var angle = (Math.PI * 2 / labels.length) * i - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
        ctx.stroke();
        ctx.fillText(labels[i], centerX + Math.cos(angle) * (radius + 30), centerY + Math.sin(angle) * (radius + 30));
    }

    ctx.strokeStyle = '#FF0055';
    ctx.fillStyle = 'rgba(255, 0, 85, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (var i = 0; i < data1.length; i++) {
        var angle = (Math.PI * 2 / labels.length) * i - Math.PI / 2;
        var r = (radius / 100) * data1[i];
        var x = centerX + Math.cos(angle) * r;
        var y = centerY + Math.sin(angle) * r;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#B5E61D';
    ctx.fillStyle = 'rgba(181, 230, 29, 0.2)';
    ctx.beginPath();
    for (var i = 0; i < data2.length; i++) {
        var angle = (Math.PI * 2 / labels.length) * i - Math.PI / 2;
        var r = (radius / 100) * data2[i];
        var x = centerX + Math.cos(angle) * r;
        var y = centerY + Math.sin(angle) * r;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FF0055';
    ctx.fillRect(50, canvas.height - 40, 20, 20);
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.fillText('乐子人', 80, canvas.height - 25);
    ctx.fillStyle = '#B5E61D';
    ctx.fillRect(200, canvas.height - 40, 20, 20);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('消费者', 230, canvas.height - 25);
}

function drawBarChart(canvas) {
    var ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 400;
    var labels = ['微博', '抖音', '小红书', 'B站', '微信'];
    var data = [85, 92, 78, 88, 65];
    var barWidth = 50;
    var gap = 20;
    var maxHeight = 300;
    var startX = 50;
    var startY = canvas.height - 50;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX, 50);
    ctx.lineTo(startX, startY);
    ctx.lineTo(canvas.width - 30, startY);
    ctx.stroke();

    ctx.font = '12px Courier New';
    ctx.textAlign = 'center';

    for (var i = 0; i < data.length; i++) {
        var x = startX + (barWidth + gap) * i + gap;
        var height = (data[i] / 100) * maxHeight;
        var y = startY - height;
        var gradient = ctx.createLinearGradient(x, y, x, startY);
        gradient.addColorStop(0, '#B5E61D');
        gradient.addColorStop(1, '#FF0055');
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, height);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, barWidth, height);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(labels[i], x + barWidth / 2, startY + 20);
        ctx.fillText(data[i], x + barWidth / 2, y - 10);
    }
}

// ================================
// 背景音乐控制功能
// ================================
function initMusicControl() {
    const musicBtn = document.getElementById('music-btn');
    const bgMusic = document.getElementById('bg-music');
    
    // 如果页面上没有这两个元素，就不执行
    if (!musicBtn || !bgMusic) return;

    const musicIcon = musicBtn.querySelector('.music-icon');
    let isPlaying = false;

    // 切换播放/暂停的逻辑
    function toggleMusic() {
        if (isPlaying) {
            bgMusic.pause();
            musicIcon.textContent = '🔇'; // 切换为静音图标
            musicBtn.classList.remove('playing');
            isPlaying = false;
        } else {
            // play() 返回一个 Promise，处理自动播放策略
            bgMusic.play().then(function() {
                musicIcon.textContent = '💿'; // 切换为光盘图标
                musicBtn.classList.add('playing');
                isPlaying = true;
            }).catch(function(err) {
                console.log("自动播放被拦截，等待用户交互: ", err);
            });
        }
    }

    // 1. 按钮点击监听
    musicBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // 防止触发其他点击事件
        toggleMusic();
    });

    // 2. 首次点击页面自动播放策略 (可选，为了体验更好)
    var autoPlayHandler = function() {
        if (!isPlaying) {
            bgMusic.play().then(function() {
                musicIcon.textContent = '💿';
                musicBtn.classList.add('playing');
                isPlaying = true;
            }).catch(function() {
                // 静默失败
            });
        }
        document.removeEventListener('click', autoPlayHandler);
    };
    document.addEventListener('click', autoPlayHandler);
}

// 页面加载
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 Project HAKIMI 启动中...');
    initNavigation();
    initModals();
    initDataViz();
    initGallerySearch();
    initMusicControl();

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var sectionId = entry.target.id;
                if (sectionId === 'stock' && !AppState.stockGame) {
                    console.log('🎲 启动 A股操盘手游戏 Pro');
                    AppState.stockGame = new StockGamePro();
                }
                if (sectionId === 'boss' && !AppState.bossGame) {
                    console.log('⚔️ 启动 Boss战游戏');
                    AppState.bossGame = new BossGame();
                }
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.section').forEach(function(section) {
        observer.observe(section);
    });

    console.log('✅ Project HAKIMI 已就绪');
});
