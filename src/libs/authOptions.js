import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/libs/mongoConnect";
import * as mongoose from "mongoose";
import bcrypt from "bcrypt";
import {User} from "@/models/User";

export const authOptions = {
    secret: process.env.SECRET_KEY,
    adapter: MongoDBAdapter(clientPromise),
    session: {
      jwt: true,
      // Set it as jwt instead of database
      strategy: "jwt",
    },
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
      }),
      CredentialsProvider({
          name: 'Credentials',
          id: 'credentials',
          credentials: {
            username: { label: "Email", type: "email", placeholder: "test@example.com" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials) {
            const email = credentials?.email;
            const password = credentials?.password;
  
            mongoose.connect(process.env.MONGO_URL);
            const user = await User.findOne({email});
            const passwordOK = user && bcrypt.compareSync(password, user.password);
            
            if (passwordOK) {
              return user;
            }
            return null;
          }
      }),
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          // Return a new token with the latest user information
          return { ...token };
        }
        return token;
      },
      async session({ session, token, req }) {
        // Get the user information from the token
        const { email } = token;
  
        if (email) {
          // Retrieve the latest user information from the database
          mongoose.connect(process.env.MONGO_URL);
          const user = await User.findOne({ email });
  
          if (user) {
            const {name, email} = user;
            // Update the session with the latest user information
            return { ...session, name, email };
          }
        }
        
        return session;
      }
    },
};