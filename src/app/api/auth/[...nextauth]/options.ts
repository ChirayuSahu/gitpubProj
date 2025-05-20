import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongo } from "@/utils/connectMongo";
import User from "@/models/user";
import { comparePass } from "@/lib/encrypt";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials) {
                    throw new Error("Credentials not provided");
                }

                try {
                    await connectMongo();
                    const user = await User.findOne({
                        $or:[
                            { email: credentials.email },
                            { username: credentials.email }
                        ]
                    });

                    if (!user) {
                        throw new Error("User not found");
                    }

                    const isValidPass = await comparePass(credentials.password, user.password);

                    if (!isValidPass) {
                        throw new Error("Invalid password");
                    }

                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                    };
                } catch (error: any) {
                    throw new Error(error.message || "Authentication failed.");
                }
            }
        })
    ],
    
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60,
    },

    pages: {
        signIn: "/login",
    },
    
    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {

        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }
            return token;
        },

        async session({ session, token }) {
            if (token?.id) {
                session.user.id = token.id.toString(); 
                session.user.email = token.email;
            }
            return session;
        },
    },


}