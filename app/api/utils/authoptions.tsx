import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import pool from '@/lib/db';

type NewType = NextAuthOptions;

export const authOptions: NewType = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
                userType: { label: "User Type", type: "text" },
            },
            async authorize(credentials) {
                const { username, password, userType } = credentials || {};

                if (!username || !password || !userType) {
                    return null;
                }

                try {
                    const query = userType === 'trustadmin'
                        ? `SELECT * FROM admin WHERE username = ? AND password = ?`
                        : userType === 'trustsub'
                            ? `SELECT * FROM subadmin WHERE username = ? AND password = ?`
                            : `SELECT * FROM user WHERE User_ID = ? AND password = ?`;

                    const [rows]: any = await pool.execute(query, [username, password]);

                    const user = rows?.[0];
                    console.log(rows, user);

                    if (user) {
                        return { ...user }; // Return user object if found
                    } else {
                        return null;
                    }
                } catch (error) {
                    console.error("Error during authentication:", error);
                    return null;
                }
            },
        }),
    ],
    pages: {
        // signIn: "/auth/signin", // Custom sign-in page
    },
    session: {
        strategy: "jwt", // Use JWT session strategy
    },
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.user = user; // Store the user object in the JWT token
            }
            return token;
        },
        async session({ session, token }: any) {
            if (token) {
                session.user = token.user; // Attach user data to session
            }
            return session;
        },
    },
};