# Documentation

[Reference](https://www.pronextjs.dev/workshops/pro-next-js-workshop-hl06z/create-and-deploy-a-nextjs-application)

## Step by Step

1. Creation of new project:

    ```bash
    pnpm dlx create-next-app@latest _APP_TITLE_ --use pnpm
    ```

    Note: Yes to all

2. Node Modules

    ```bash
    pnpm run dev
    ```

3. ShadCN

    ```bash
    # instead of:
    # pnpm dlx shadcn@latest init
    # use this:
    pnpm dlx shadcn@latest init -d
    ```

## Documentation to read

1. [Followers](https://docs.github.com/en/rest/users/followers?apiVersion=2022-11-28) Github Endpoints
2. [OAuth](https://github.com/settings/developers)
3. Inspired From This [video](https://www.youtube.com/watch?v=O8Ae6MC5bf4&ab_channel=tapaScriptbyTapasAdhikary) but full modified for a typescript code and optimization. It was from Next-Auth-5, and this is the [code](https://github.com/tapascript/learn-next-auth) documentation.
4. Auth Error Encounter [Fix](https://forum.codewithmosh.com/t/next-js-error-when-implementing-sessionprovider/24629/2) For SessionProvider
