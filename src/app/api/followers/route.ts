// src/app/api/followers/route.ts
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

        // Don't retry on authentication errors or when out of retries
        if (
            retries === 0 ||
            axiosError.response?.status === 401 ||
            axiosError.response?.status === 403
        ) {
            throw error;
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));

        // Retry with exponential backoff
        return fetchWithRetry<T>(url, config, retries - 1, delay * 2);
    }
}

async function fetchAllPages(url: string, accessToken: string): Promise<GitHubUser[]> {
    let allUsers: GitHubUser[] = [];
    let page = 1;
    const perPage = 100; // Maximum allowed by GitHub API

    const headers = {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
    };

    try {
        while (true) {
            const pageUrl = `${url}?per_page=${perPage}&page=${page}`;

            const users = await fetchWithRetry<GitHubUser[]>(
                pageUrl,
                { headers }
            );

            if (users.length === 0) {
                break;
            }

            allUsers = [...allUsers, ...users];
            page++;

            // Optional: Add a small delay between requests to be nice to the API
            await new Promise(resolve => setTimeout(resolve, 100));
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
    try {
        const session = await getServerSession(authOptions);

        if (!session?.accessToken) {
            return NextResponse.json(
                { error: 'You must be logged in.' },
                { status: 401 }
            );
        }

        // Add caching headers
        const headers = {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        };

        const followers = await fetchAllPages(
            'https://api.github.com/user/followers',
            session.accessToken
        );

        return NextResponse.json(followers, {
            status: 200,
            headers
        });
    } catch (error) {
        const axiosError = error as AxiosError<GitHubAPIError>;
        console.error('Error fetching followers:', axiosError);

        // Handle specific error cases
        if (axiosError.response?.status === 401) {
            return NextResponse.json(
                { error: 'Authentication failed. Please try logging in again.' },
                { status: 401 }
            );
        }

        if (axiosError.response?.status === 403) {
            const rateLimitExceeded = axiosError.response.headers['x-ratelimit-remaining'] === '0';
            const message = rateLimitExceeded
                ? 'Rate limit exceeded. Please try again later.'
                : 'Access forbidden. Please check your permissions.';

            return NextResponse.json(
                { error: message },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to fetch followers' },
            { status: 500 }
        );
    }
}