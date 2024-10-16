import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { GitHubUser } from '@/types/github';

async function fetchAllPages(url: string, accessToken: string): Promise<GitHubUser[]> {
    let allUsers: GitHubUser[] = [];
    let nextUrl = url;

    while (nextUrl) {
        const response = await axios.get<GitHubUser[]>(nextUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28',
            },
        });
        allUsers = [...allUsers, ...response.data];

        const linkHeader = response.headers.link;
        nextUrl = '';
        if (linkHeader) {
            const links = linkHeader.split(',');
            const nextLink = links.find((link: string) => link.includes('rel="next"'));
            if (nextLink) {
                nextUrl = nextLink.split(';')[0].trim().slice(1, -1);
            }
        }
    }

    return allUsers;
}

export async function GET(req: NextRequest) {
    console.log(req);
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
        return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 });
    }

    try {
        const followers = await fetchAllPages('https://api.github.com/user/followers', session.accessToken);
        return NextResponse.json(followers, { status: 200 });
    } catch (error) {
        console.error('Error fetching followers:', error);
        return NextResponse.json({ error: 'Failed to fetch followers' }, { status: 500 });
    }
}