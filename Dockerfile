# ベースイメージ
FROM node:20

# 作業ディレクトリを作成
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# プロジェクト全体をコピー
COPY . .

# Vite のデフォルトポート
EXPOSE 5173

# 開発サーバーを起動
CMD ["npm", "run", "dev", "--", "--host"]
