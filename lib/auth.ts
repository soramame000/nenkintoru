import { type NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserByEmail } from "./db";
import { loginRateLimit } from "./ratelimit";
import { verifyPassword } from "./password";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function getClientIpFromReq(req: unknown) {
  // NextAuthのauthorizeは環境によりreqの形が変わるため、両対応
  const anyReq = req as any;
  const headers = anyReq?.headers;
  let forwarded: string | null | undefined;
  let realIp: string | null | undefined;
  if (headers?.get) {
    forwarded = headers.get("x-forwarded-for");
    realIp = headers.get("x-real-ip");
  } else if (headers) {
    forwarded = headers["x-forwarded-for"];
    realIp = headers["x-real-ip"];
  }
  if (forwarded) return String(forwarded).split(",")[0]?.trim() || "unknown";
  if (realIp) return String(realIp);
  return "unknown";
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) return null;
        const email = normalizeEmail(credentials.email);

        if (loginRateLimit) {
          const ip = getClientIpFromReq(req);
          const { success } = await loginRateLimit.limit(`login:${ip}:${email}`);
          if (!success) return null;
        }

        const user = await getUserByEmail(email);
        if (!user?.password_hash) return null;
        if (!user?.email) return null;
        const isValid = await verifyPassword(credentials.password, user.password_hash);
        if (!isValid) return null;
        return {
          id: user.id,
          email: normalizeEmail(user.email),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.email = user.email ?? undefined;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? "";
        session.user.email = typeof token.email === "string" ? token.email : "";
      }
      return session;
    },
  },
};

export async function getCurrentSession() {
  return getServerSession(authOptions);
}
