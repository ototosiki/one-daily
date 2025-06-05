# Nodeの公式イメージ
FROM node:18

# 作業ディレクトリを設定
WORKDIR /app

# パッケージのコピーとインストール
COPY package*.json ./
RUN npm install

# アプリのソースコードをコピー
COPY . .

# APIサーバーを起動
CMD ["node", "app.js"]

# ポートを公開（開発用）
EXPOSE 3001
