# GitHub Follower Monitor

**GitHub Follower Monitor** is a tool that helps you track and manage your GitHub following. It checks whether users you follow are also following you back, making it easier to clean up your following list by unfollowing those who don't reciprocate.

## Features
- Track and manage your GitHub followers.
- Detect whether users you follow are following you back.
- Reduce the count of your "following" easily by unfollowing non-followers.
- Simple and intuitive interface with real-time updates.

## Installation

### Step by Step Guide

1. **Create a New Next.js Project**

   Use the following command to create a new Next.js project with pnpm:

   ```bash
   pnpm dlx create-next-app@latest _APP_TITLE_ --use pnpm
   ```

   When prompted, select "Yes" to all options.

2. **Run the Project**

   Install dependencies and run the development server:

   ```bash
   pnpm run dev
   ```

3. **ShadCN UI Integration**

   Set up ShadCN with the following command to initialize with a custom directory (`-d` flag):

   ```bash
   pnpm dlx shadcn@latest init -d
   ```

## Usage

1. **OAuth Setup**

   - Go to your GitHub [OAuth Apps settings](https://github.com/settings/developers).
   - Create a new OAuth app and configure the necessary callback URLs.
   - Store your `CLIENT_ID` and `CLIENT_SECRET` for integrating authentication.

2. **GitHub API**

   The app uses the GitHub API to retrieve the list of followers and followings. Check the [GitHub Followers API documentation](https://docs.github.com/en/rest/users/followers?apiVersion=2022-11-28) for reference on endpoints.

3. **Authentication**

   The app leverages OAuth for authentication to access your GitHub account securely. The setup was inspired by [this video](https://www.youtube.com/watch?v=O8Ae6MC5bf4&ab_channel=tapaScriptbyTapasAdhikary) and adapted to use TypeScript for optimized performance. You can review the original Next-Auth setup in this [repository](https://github.com/tapascript/learn-next-auth).

   In case of any session provider errors, check this [auth error fix](https://forum.codewithmosh.com/t/next-js-error-when-implementing-sessionprovider/24629/2).

## Documentation to Read

1. [GitHub Followers API](https://docs.github.com/en/rest/users/followers?apiVersion=2022-11-28)
2. [GitHub OAuth Documentation](https://github.com/settings/developers)
3. [OAuth Setup Tutorial](https://www.youtube.com/watch?v=O8Ae6MC5bf4&ab_channel=tapaScriptbyTapasAdhikary) with Next.js and Next-Auth.

## Future Work
- Implement automatic unfollowing of users who don't follow you back.
- Add user notifications for follow-back status changes.
- Optimize the UI with ShadCN components and styling.

## Contributions
Feel free to open issues or submit pull requests for feature suggestions or bug fixes. All contributions are welcome!
