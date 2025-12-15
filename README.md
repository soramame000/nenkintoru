# 年金トール君

障害年金の「病歴・就労状況等申立書」を最短で下書き生成するNext.js 14アプリ。

## 仕様（再定義）

- `docs/APP_DEFINITION.md`

## セットアップ

```bash
npm install
npm run dev
```

### 必須環境変数（.env.local）

```
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

OPENAI_API_KEY=your_openai_api_key
# 任意（未指定なら gpt-5.2）
OPENAI_MODEL=gpt-5.2
# 任意（チューニング用）
OPENAI_TIMEOUT_MS=45000
OPENAI_MAX_RETRIES=2
OPENAI_TEMPERATURE=0.4
OPENAI_MAX_OUTPUT_TOKENS=1800
OPENAI_REASONING_EFFORT=low
OPENAI_VERBOSITY=low

STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx
```

## 主な機能

- NextAuth（Credentials）+ Supabaseでのメール/パスワード認証
- Stripe CheckoutとWebhookで3ヶ月サブスク管理（30回まで生成）
- Upstash Redisで生成APIとログインへのレートリミット
- OpenAI GPTで申立書下書き生成
- PDF（@react-pdf/renderer）/Excel（exceljs）出力
- 5ステップの入力フロー（症状・病歴・就労・追加情報）
- セキュリティヘッダー（CSP等）と入力バリデーション（Zod）
