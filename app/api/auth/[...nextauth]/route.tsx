import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import pool from '@/lib/db';
import { authOptions } from "../../utils/authoptions";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
