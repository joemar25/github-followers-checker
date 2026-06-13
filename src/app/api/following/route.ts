// src\app\api\following\route.ts
import { NextResponse } from 'next/server';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { GitHubUser } from '@/types/github';

interface GitHubAPIError {
    message: string;
    documentation_url?: string;
}

async function fetchWithRetry<T>(
    url: string,
    config: AxiosRequestConfig,
    retries = 3,
    delay = 1000
): Promise<T> {
    try {
        const response = await axios.get<T>(url, config);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<GitHubAPIError>;
        if (
            retries === 0 ||
            axiosError.response?.status === 401 ||
            axiosError.response?.status === 403
        ) {
            throw error;
        }
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry<T>(url, config, retries - 1, delay * 2);
    }
}

async function fetchAllPages(baseUrl: string, accessToken: string): Promise<GitHubUser[]> {
    const perPage = 100;
    const headers = {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
    };

    try {
        const firstPageUrl = `${baseUrl}?per_page=${perPage}&page=1`;
        const response = await axios.get<GitHubUser[]>(firstPageUrl, { headers });
        let allUsers = response.data;

        const linkHeader = response.headers.link;
        if (linkHeader) {
            const lastPageMatch = linkHeader.match(/&page=(\d+)>;\s*rel="last"/);
            if (lastPageMatch) {
                const lastPage = parseInt(lastPageMatch[1], 10);
                if (lastPage > 1) {
                    const promises = [];
                    for (let page = 2; page <= lastPage; page++) {
                        const pageUrl = `${baseUrl}?per_page=${perPage}&page=${page}`;
                        promises.push(fetchWithRetry<GitHubUser[]>(pageUrl, { headers }));
                    }
                    const results = await Promise.all(promises);
                    for (const users of results) {
                        allUsers = [...allUsers, ...users];
                    }
                }
            }
        }

        return allUsers;
    } catch (error) {
        const axiosError = error as AxiosError<GitHubAPIError>;
        console.error('Error in fetchAllPages:',
            axiosError.response?.status,
            axiosError.response?.data
        );
        throw error;
    }
}

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
        return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 });
    }

    try {
        const following = await fetchAllPages('https://api.github.com/user/following', session.accessToken);
        return NextResponse.json(following, { status: 200 });
    } catch (error) {
        console.error('Error fetching following:', error);
        return NextResponse.json({ error: 'Failed to fetch following' }, { status: 500 });
    }
}
