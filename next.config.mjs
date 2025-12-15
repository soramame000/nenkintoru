const isDev = process.env.NODE_ENV !== "production";

function buildCsp() {
  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    // Next devで必要になりやすい
    ...(isDev ? ["'unsafe-eval'"] : []),
    "https://js.stripe.com",
    // Cloudflare Web Analytics (beacon)
    "https://static.cloudflareinsights.com",
  ];

  const connectSrc = [
    "'self'",
    "https://api.stripe.com",
    // Supabase / Upstash（プロジェクト依存のためワイルドカード許容）
    "https://*.supabase.co",
    "https://*.supabase.in",
    "https://*.upstash.io",
  ];

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    `script-src ${scriptSrc.join(" ")}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    `connect-src ${connectSrc.join(" ")}`,
    "frame-src https://js.stripe.com https://hooks.stripe.com",
    "form-action 'self' https://checkout.stripe.com",
  ].join("; ");
}

const securityHeaders = [
  { key: "Content-Security-Policy", value: buildCsp() },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      { source: "/auth/login", destination: "/login", permanent: true },
      { source: "/auth/register", destination: "/register", permanent: true },
      { source: "/auth/forgot-password", destination: "/forgot-password", permanent: true },
    ];
  },
};

export default nextConfig;
