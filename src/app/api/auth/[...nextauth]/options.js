import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import sendVerificationEmail from "@/actions/utils/send-verification-email";
import UserModel from "@/models/user.model";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!user) {
            throw new Error("User not found with this email or username");
          }

          if (!user.isVerified) {
            const verifyCode = Math.floor(
              100000 + Math.random() * 900000
            ).toString();
            user.verifyCode = verifyCode;
            user.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour expiry
            await user.save();
            const emailResponse = await sendVerificationEmail(
              user.email,
              verifyCode
            );
            if (!emailResponse.success) {
              throw new Error(emailResponse.message);
            }
            throw new Error(`UNVERIFIED_USER:${user.username}`);
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordCorrect) {
            throw new Error("Incorrect password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            username: user.username,
            name: user.name,
            role: user.role,
          };
        } catch (err) {
          throw new Error(err.message);
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, session, trigger }) {
      if (user && account) {
        // Initial sign in
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.username = token.username;
        session.user.name = token.name;
        session.user.role = token.role;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    verifyRequest: "/verify",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
