# 🚀 Project HAKIMI 部署指南

## 方法 1：GitHub Pages（推荐 ⭐）

### 优点
- ✅ 完全免费
- ✅ 自动 HTTPS
- ✅ 获得公开访问的网址
- ✅ 无需下载到本地

### 部署步骤

#### 步骤 1：进入仓库设置
1. 在 GitHub 仓库页面，点击顶部的 **Settings**（设置）

#### 步骤 2：启用 Pages
2. 在左侧菜单中找到 **Pages**
3. 在 "Build and deployment" 部分：
   - **Source**: 选择 "Deploy from a branch"
   - **Branch**: 选择 `claude/marketing-campaign-spa-01WYNDKa1DB5gsuFthV3xC4z`
   - **Folder**: 选择 `/ (root)`
4. 点击 **Save** 按钮

#### 步骤 3：等待部署
5. 等待 1-3 分钟（GitHub 会自动构建）
6. 刷新页面，顶部会显示：
   ```
   Your site is live at https://gao725216-afk.github.io/journal-reader/
   ```

#### 步骤 4：访问网站
7. 点击上面的链接即可访问你的网站！

### 注意事项
- 如果你的分支不是主分支，确保选择正确的分支名
- 第一次部署可能需要等待几分钟
- 每次 git push 后，网站会自动更新

---

## 方法 2：下载到本地运行

### 步骤 1：下载代码
在 GitHub 仓库页面：
1. 点击绿色的 **Code** 按钮
2. 选择 **Download ZIP**
3. 解压文件到你的电脑

### 步骤 2：运行网站

#### 选项 A：直接打开（最简单）
- 找到解压后的文件夹
- 双击 `index.html` 文件
- 浏览器会自动打开

#### 选项 B：使用本地服务器（推荐）

**使用 Python（推荐）**
```bash
# 进入项目目录
cd journal-reader

# 启动服务器
python3 -m http.server 8000

# 访问 http://localhost:8000
```

**使用 Node.js**
```bash
# 安装 http-server
npm install -g http-server

# 启动
http-server

# 访问显示的地址
```

**使用 VS Code**
1. 安装 "Live Server" 插件
2. 右键点击 `index.html`
3. 选择 "Open with Live Server"

---

## 方法 3：使用 Netlify（超简单免费托管）

### 优点
- ✅ 完全免费
- ✅ 自动 HTTPS
- ✅ 获得 yoursite.netlify.app 域名
- ✅ 拖拽即可部署

### 部署步骤

#### 方式 A：通过 GitHub 连接
1. 访问 https://www.netlify.com/
2. 点击 **Sign up** 注册（可用 GitHub 账号登录）
3. 点击 **Add new site** → **Import an existing project**
4. 选择 **GitHub**，授权 Netlify 访问
5. 选择 `journal-reader` 仓库
6. 分支选择 `claude/marketing-campaign-spa-01WYNDKa1DB5gsuFthV3xC4z`
7. 构建设置留空（纯静态网站）
8. 点击 **Deploy site**
9. 等待 1 分钟，获得网址！

#### 方式 B：拖拽部署（更快）
1. 下载代码 ZIP 并解压
2. 访问 https://app.netlify.com/drop
3. 直接拖拽整个文件夹到页面
4. 立即获得网址！

---

## 方法 4：使用 Vercel（类似 Netlify）

### 部署步骤
1. 访问 https://vercel.com/
2. 使用 GitHub 账号登录
3. 点击 **Add New** → **Project**
4. 选择 `journal-reader` 仓库
5. 点击 **Deploy**
6. 等待部署完成，获得网址！

---

## 方法 5：使用 GitHub Codespaces（在线编辑）

### 步骤
1. 在 GitHub 仓库页面，点击绿色的 **Code** 按钮
2. 选择 **Codespaces** 标签
3. 点击 **Create codespace on [你的分支名]**
4. 等待环境启动（约 1 分钟）
5. 在终端运行：
   ```bash
   python3 -m http.server 8000
   ```
6. 点击弹出的 "Open in Browser" 即可查看

---

## 📋 部署前检查清单

无论使用哪种方法，部署前请确认：

- [ ] 视频链接已替换（`js/app.js` 第 6-10 行）
- [ ] 购买链接已替换（`js/app.js` 第 12 行）
- [ ] 购买链接已替换（`index.html` 中搜索 `LINK_PRODUCT_BUY`）
- [ ] 资产文件已准备（`assets/` 目录）
- [ ] 本地测试通过

---

## 🎯 推荐方案对比

| 方案 | 难度 | 速度 | 适合场景 |
|------|------|------|----------|
| GitHub Pages | ⭐⭐ | 慢（1-3分钟） | 公开展示、长期托管 |
| 下载本地 | ⭐ | 快（立即） | 本地测试、开发 |
| Netlify 拖拽 | ⭐ | 快（1分钟） | 快速上线、临时展示 |
| Netlify GitHub | ⭐⭐ | 中（2分钟） | 自动部署、团队协作 |
| Vercel | ⭐⭐ | 快（1分钟） | 同 Netlify |
| Codespaces | ⭐⭐⭐ | 中（需等启动） | 在线编辑、无本地环境 |

---

## 🐛 常见问题

### Q: GitHub Pages 显示 404
**A**: 
- 检查是否选择了正确的分支
- 等待 3-5 分钟让 GitHub 完成部署
- 确保 `index.html` 在仓库根目录

### Q: 图片不显示
**A**: 
- 确保图片文件在 `assets/` 文件夹
- 检查文件名大小写是否匹配
- 浏览器按 F12 查看控制台错误

### Q: 视频无法播放
**A**: 
- 确保使用 YouTube embed 链接格式：
  `https://www.youtube.com/embed/视频ID`
- 检查视频是否允许嵌入

### Q: 本地打开样式错乱
**A**: 
- 使用本地服务器而不是直接双击打开
- 某些浏览器对本地文件有安全限制

---

## 🎉 快速开始推荐

**如果你想快速看到效果**：
👉 使用 **Netlify 拖拽部署**（最快，1 分钟搞定）

**如果你想长期使用**：
👉 使用 **GitHub Pages**（免费，稳定，自动更新）

**如果你想本地开发**：
👉 **下载到本地** + Python 服务器

---

需要帮助？查看 `README_HAKIMI.md` 获取更多信息！
