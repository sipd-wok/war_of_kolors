import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { User } from "next-auth";
import supabase from "./db/db";
import {
  encode as defaultEncode,
  decode as defaultDecode,
} from "next-auth/jwt";

// Extend the NextAuth User type with your additional properties
declare module "next-auth" {
  interface User {
    userID: string;
    username: string;
    password: string;
    role: string;
  }
}

export const { auth, signIn, handlers } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        userID: { label: "User ID", type: "text" },
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Account Type", type: "text" },
      },
      authorize: async (credentials): Promise<User | null> => {
        if (!credentials.userID) {
          return null;
        }

        const { data, error } = await supabase
          .from("users_tbl")
          .select()
          .eq("user_id", credentials.userID)
          .eq("password", credentials.password)
          .single();

        if (!data) {
          // ma check sng role
          const { data, error: roleError } = await supabase
            .from("roles_tbl")
            .select()
            .eq("role", credentials.role)
            .single();

          if (roleError || !data) {
            throw new Error("No role found.");
          }

          // create new user
          const { error } = await supabase.from("users_tbl").insert({
            user_id: credentials.userID,
            username: credentials.username,
            password: credentials.password,
            role_id: data.id,
          });

          if (error) {
            throw new Error("Somethind is wrong.");
          }

          return {
            userID: credentials.userID,
            username: credentials.username,
            password: credentials.password,
            role: credentials.role,
          } as User;
        }

        if (error) {
          throw new Error("Somethind is wrong.");
        }

        return data as User;
      },
    }),
  ],
  callbacks: {
    // amo na d ang makita sa client side
    async jwt({ token, user, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true;
        // Add user data to the token if available
        if (user) {
          token.userID = user.userID;
          token.username = user.username;
          token.role = user.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Make user data available in the session
      if (token) {
        session.user = {
          ...session.user,
          userID: token.userID as string,
          username: token.username as string,
          role: token.role as string,
        };
      }
      return session;
    },
  },
  jwt: {
    encode: async function (params) {
      // console.log("Encoding params:", params);
      // Always use the default encode function
      const encodedToken = await defaultEncode(params);
      // console.log("Encoded token:", encodedToken);
      return encodedToken;
    },
    decode: async function (params) {
      // console.log("Decoding params:", params);
      try {
        // Try to decode using default decode
        const decodedToken = await defaultDecode(params);
        // console.log("Decoded token:", decodedToken);
        return decodedToken;
      } catch (error) {
        // If there's an error decoding, return null to invalidate the session
        console.error("Error decoding token:", error);
        return null;
      }
    },
  },
});
