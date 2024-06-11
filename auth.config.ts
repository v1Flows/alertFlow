import { NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';

const authConfig = {
  providers: [
    CredentialProvider({
      credentials: {
        email: {
          type: 'email'
        },
        password: {
          type: 'password'
        }
      },
      async authorize(credentials, req) {
        const response = await fetch('http://localhost:8080/api/token', {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { 'Content-Type': 'application/json' }
        })

        if (!response.ok) return null

        const data = await response.json();

        let user = {
          id: data.user.id,
          name: data.user.username,
          email: data.user.email,
          token: data.token
        }

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    })
  ],
  pages: {
    signIn: '/' //sigin page
  }
} satisfies NextAuthConfig;

export default authConfig;
