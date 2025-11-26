// ================================
// A股操盘手游戏 Pro - 完全重写版
// ================================

function StockGamePro() {
    // 游戏状态
    this.cash = 100000;          // 现金
    this.shares = 0;             // 持股数
    this.price = 14.50;          // 当前股价
    this.startPrice = 14.50;     // 开盘价
    this.history = [];           // 价格历史
    this.labels = [];            // 时间标签
    this.day = 0;                // 交易日
    this.volatility = 0.02;      // 波动率
    this.trend = 0;              // 市场趋势

    // 新闻列表
    this.newsItems = [
        "九阳豆业辟谣：'哈基米'仅为营销活动，无股权关联。",
        "知名游资 '章盟主' 现身龙虎榜，大举买入九阳！",
        "监管部门关注股价异动，要求公司停牌核查！",
        "全网 '哈基米' 视频播放量突破 10 亿！",
        "技术面出现 '断头铡刀'，散户恐慌出逃。",
        "南北绿豆浆卖断货，黄牛价炒至 88 元！",
        "某大V发文：九阳要成为下一个茅台？",
        "基金经理现身直播间，推荐买入九阳！",
        "证监会提示风险：警惕跟风炒作！",
        "盘后数据：北向资金净流入 3 亿元！"
    ];

    // 事件系统（保留原有的）
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

    this.chart = null;
    this.priceUpdateInterval = null;
    this.eventTimer = null;
    this.isPlaying = false;

    this.init();
}

StockGamePro.prototype.init = function() {
    var self = this;

    // 初始化历史数据
    for (var i = 0; i < 20; i++) {
        this.history.push(14.50 + (Math.random() - 0.5));
        this.labels.push('');
    }

    // 初始化 Chart.js
    this.initChart();

    // 绑定按钮
    var buyBtn = document.getElementById('btn-buy-stock');
    var sellBtn = document.getElementById('btn-sell-stock');
    var rumorBtn = document.getElementById('btn-rumor');
    var greenbeanBtn = document.getElementById('btn-greenbean');

    if (buyBtn) buyBtn.addEventListener('click', function() { self.buyStock(); });
    if (sellBtn) sellBtn.addEventListener('click', function() { self.sellStock(); });
    if (rumorBtn) rumorBtn.addEventListener('click', function() { self.spreadRumor(); });
    if (greenbeanBtn) greenbeanBtn.addEventListener('click', function() { self.buyGreenbean(); });

    // 开始游戏
    this.isPlaying = true;
    this.updateUI();
    this.startMarketUpdate();
    this.startEventLoop();
};

StockGamePro.prototype.initChart = function() {
    var canvas = document.getElementById('chart-canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');

    this.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: this.labels,
            datasets: [{
                label: '股价 (CNY)',
                data: this.history,
                borderColor: '#ff3333',
                backgroundColor: 'rgba(255, 51, 51, 0.1)',
                borderWidth: 2,
                pointRadius: 0,
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { display: false },
                y: {
                    grid: { color: '#333' },
                    ticks: { color: '#888' }
                }
            }
        }
    });
};

StockGamePro.prototype.startMarketUpdate = function() {
    var self = this;

    this.priceUpdateInterval = setInterval(function() {
        if (!self.isPlaying) return;

        self.day++;

        // 随机新闻（5%概率）
        if (Math.random() < 0.05) {
            self.triggerNews();
        }

        // 价格波动
        var randomMove = (Math.random() - 0.48 + self.trend) * self.price * self.volatility;
        self.price += randomMove;

        // 涨跌停限制 (10%)
        var limit = self.startPrice * 0.1;
        if (self.price > self.startPrice + limit) self.price = self.startPrice + limit;
        if (self.price < self.startPrice - limit) self.price = self.startPrice - limit;
        if (self.price < 0.1) self.price = 0.1;

        // 更新历史数据
        self.history.push(self.price);
        self.labels.push('');
        if (self.history.length > 50) {
            self.history.shift();
            self.labels.shift();
        }

        self.updateUI();
        self.updateChart();
        self.checkGameOver();
    }, 1000);  // 每秒更新
};

StockGamePro.prototype.buyStock = function() {
    if (!this.isPlaying) return;

    var leverage = parseInt(document.getElementById('leverage-select').value);
    var maxBuy = Math.floor((this.cash * leverage) / this.price);

    if (maxBuy <= 0) {
        this.addLog('<span style="color:yellow">资金不足！无法买入。</span>');
        return;
    }

    this.shares += maxBuy;
    this.cash -= (maxBuy * this.price);
    this.addLog('<span style="color:#ff3333">融资买入 ' + maxBuy + ' 股 (杠杆 x' + leverage + ')，成本 ¥' + (maxBuy * this.price).toFixed(2) + '</span>');

    // 买入推动股价上涨
    this.price += this.price * 0.01;

    this.updateUI();
};

StockGamePro.prototype.sellStock = function() {
    if (!this.isPlaying) return;
    if (this.shares <= 0) {
        this.addLog('<span style="color:yellow">没有持仓！</span>');
        return;
    }

    var revenue = this.shares * this.price;
    this.cash += revenue;
    this.addLog('<span style="color:#00cc00">卖出 ' + this.shares + ' 股，套现 ¥' + Math.floor(revenue).toLocaleString() + '</span>');
    this.shares = 0;

    // 抛售导致股价下跌
    this.price -= this.price * 0.015;

    this.updateUI();
};

StockGamePro.prototype.spreadRumor = function() {
    if (this.cash < 5000) {
        alert("资金不足！需要¥5000买水军。");
        return;
    }

    this.cash -= 5000;
    this.trend = 0.02;           // 制造上涨趋势
    this.volatility = 0.05;       // 波动加剧
    this.addLog('📢 花费 ¥5000 买热搜，散户情绪高涨！');
    this.triggerNews("快讯：网传知名基金经理重仓九阳！");
    this.updateUI();
};

StockGamePro.prototype.buyGreenbean = function() {
    if (this.cash < 39) {
        alert("钱不够买绿豆浆...");
        return;
    }

    this.cash -= 39;
    this.volatility = 0.01;       // 降低波动
    this.trend = 0;               // 市场冷静
    this.addLog('🫘 喝了杯绿豆浆，心态平稳了，市场波动降低。');
    this.updateUI();
};

StockGamePro.prototype.triggerNews = function(customContent) {
    var content = customContent || this.newsItems[Math.floor(Math.random() * this.newsItems.length)];
    var ticker = document.getElementById('news-ticker');

    if (ticker) {
        ticker.textContent = content;
        // 重启动画
        ticker.style.animation = 'none';
        setTimeout(function() {
            ticker.style.animation = 'ticker 15s linear infinite';
        }, 10);
    }

    // 新闻影响股价
    if (content.includes('涨') || content.includes('买入') || content.includes('10 亿') || content.includes('流入')) {
        this.trend = 0.01;
    } else if (content.includes('辟谣') || content.includes('监管') || content.includes('出逃') || content.includes('风险')) {
        this.trend = -0.02;
    }
};

StockGamePro.prototype.startEventLoop = function() {
    var self = this;

    var triggerEvent = function() {
        if (!self.isPlaying) return;

        var event = self.events[Math.floor(Math.random() * self.events.length)];
        self.showEventCard(event);

        var delay = 10000 + Math.random() * 10000;  // 10-20秒
        self.eventTimer = setTimeout(triggerEvent, delay);
    };

    this.eventTimer = setTimeout(triggerEvent, 8000);
};

StockGamePro.prototype.showEventCard = function(event) {
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

StockGamePro.prototype.handleEventChoice = function(action, event) {
    if (action === event.correct) {
        this.price += this.price * (Math.abs(event.impact) / 100);
        this.cash += Math.abs(event.impact) * 500;
        this.addLog('<span style="color:#00cc00">✓ 正确判断！获利 ¥' + (Math.abs(event.impact) * 500) + '</span>');
    } else {
        this.price -= this.price * (Math.abs(event.impact) / 100);
        this.cash -= Math.abs(event.impact) * 500;
        this.addLog('<span style="color:#ff3333">✗ 判断失误！亏损 ¥' + (Math.abs(event.impact) * 500) + '</span>');
    }

    this.updateUI();
    this.updateChart();
    this.checkGameOver();
};

StockGamePro.prototype.updateUI = function() {
    // 现金和持仓
    var moneyEl = document.getElementById('stock-money');
    var sharesEl = document.getElementById('stock-shares');
    var valueEl = document.getElementById('stock-value');
    var totalEl = document.getElementById('stock-total');

    if (moneyEl) moneyEl.textContent = '¥' + Math.floor(this.cash).toLocaleString();
    if (sharesEl) sharesEl.textContent = this.shares + ' 股';
    if (valueEl) valueEl.textContent = '¥' + Math.floor(this.shares * this.price).toLocaleString();

    var totalAsset = this.cash + (this.shares * this.price);
    if (totalEl) {
        totalEl.textContent = '¥' + Math.floor(totalAsset).toLocaleString();
        totalEl.style.color = totalAsset >= 100000 ? '#B5E61D' : '#ff3333';
    }

    // 股价
    var priceEl = document.getElementById('stock-price');
    var changeEl = document.getElementById('stock-change');
    var dayEl = document.getElementById('stock-day');

    if (priceEl) {
        priceEl.textContent = '¥' + this.price.toFixed(2);
        var pct = ((this.price - this.startPrice) / this.startPrice) * 100;
        var color = pct >= 0 ? '#ff3333' : '#00cc00';  // A股红涨绿跌
        priceEl.style.color = color;

        if (changeEl) {
            changeEl.textContent = (pct >= 0 ? '+' : '') + pct.toFixed(2) + '%';
            changeEl.style.color = color;
        }
    }

    if (dayEl) dayEl.textContent = this.day;
};

StockGamePro.prototype.updateChart = function() {
    if (!this.chart) return;

    var pct = ((this.price - this.startPrice) / this.startPrice) * 100;
    var color = pct >= 0 ? '#ff3333' : '#00cc00';
    var bgColor = pct >= 0 ? 'rgba(255, 51, 51, 0.1)' : 'rgba(0, 204, 0, 0.1)';

    this.chart.data.datasets[0].borderColor = color;
    this.chart.data.datasets[0].backgroundColor = bgColor;
    this.chart.update('none');  // 不播放动画
};

StockGamePro.prototype.addLog = function(message) {
    var logContent = document.querySelector('#trade-log .log-content');
    if (!logContent) return;

    var p = document.createElement('p');
    p.innerHTML = '> ' + message;
    logContent.insertBefore(p, logContent.firstChild);

    // 限制日志数量
    while (logContent.children.length > 20) {
        logContent.removeChild(logContent.lastChild);
    }
};

StockGamePro.prototype.checkGameOver = function() {
    var totalAsset = this.cash + (this.shares * this.price);

    if (totalAsset <= 0 || this.cash < -50000) {
        this.isPlaying = false;
        clearInterval(this.priceUpdateInterval);
        clearTimeout(this.eventTimer);
        this.showCrashModal();
    }
};

StockGamePro.prototype.showCrashModal = function() {
    var self = this;
    var crashModal = document.getElementById('crash-modal');

    if (crashModal) {
        crashModal.style.display = 'flex';

        setTimeout(function() {
            window.open(PRODUCT_LINK, '_blank');
            crashModal.style.display = 'none';
            // 重置游戏
            self.resetGame();
        }, 2000);
    }
};

StockGamePro.prototype.resetGame = function() {
    this.cash = 100000;
    this.shares = 0;
    this.price = 14.50;
    this.startPrice = 14.50;
    this.history = [];
    this.labels = [];
    this.day = 0;
    this.volatility = 0.02;
    this.trend = 0;

    for (var i = 0; i < 20; i++) {
        this.history.push(14.50 + (Math.random() - 0.5));
        this.labels.push('');
    }

    this.isPlaying = true;
    this.updateUI();
    this.updateChart();
    this.addLog('游戏重新开始！');
    this.startMarketUpdate();
    this.startEventLoop();
};
