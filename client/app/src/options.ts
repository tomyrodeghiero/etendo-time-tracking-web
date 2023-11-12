import NextAuth from "next-auth";
import AtlassianProvider from "next-auth/providers/atlassian";

export const options = {
  // Configure one or more authentication providers
  providers: [
    AtlassianProvider({
      clientId: "JvvKaeggb8ThuS7ankNK3VNhv8rp4Fe7",
      clientSecret: "ATOAYmrbaE-0brHB-7I9RZrLtJlPrbcoMAgnuc43uZq4cV0QSof71ZgQ4GbNw6BDP-hgD45FB3A0",
      authorization: {
        params: {
          scope: "write:jira-work read:jira-work read:jira-user offline_access read:me"
        }
      }
    })
  ]
};

export default NextAuth(options);
