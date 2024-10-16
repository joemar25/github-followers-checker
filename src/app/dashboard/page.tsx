"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { GitHubUser } from "@/types/github";
import PaginatedList from "@/components/dashboard/PaginatedList";
import Logout from "@/components/auth/logout";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";

const Dashboard: React.FC = () => {
  const { data: session, status } = useSession({ required: true });
  const [followers, setFollowers] = useState<GitHubUser[]>([]);
  const [following, setFollowing] = useState<GitHubUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [followersResponse, followingResponse] = await Promise.all([
        axios.get<GitHubUser[]>("/api/followers"),
        axios.get<GitHubUser[]>("/api/following"),
      ]);

      setFollowers(followersResponse.data);
      setFollowing(followingResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session) {
      refreshData();
    }
  }, [session, refreshData]);

  const handleUnfollow = async (username: string) => {
    try {
      await axios.delete(`/api/following/${username}`);
      refreshData();
    } catch (error) {
      console.error(`Failed to unfollow ${username}`, error);
      toast.error(`Failed to unfollow ${username}. Please try again.`);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (status !== "authenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>You are not authenticated. Please log in.</p>
      </div>
    );
  }

  const followerSet = new Set(followers.map((user) => user.login));
  const notFollowingBack = following.filter(
    (user) => !followerSet.has(user.login)
  );
  const mutualFollows = followers.filter((user) =>
    following.some((f) => f.login === user.login)
  );

  return (
    <div className="mx-auto p-4 space-y-6">
      <Toaster richColors position="bottom-right" />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-medium">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <ModeToggle />
          <Logout />
        </div>
      </div>

      <BentoGrid className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        <BentoGridItem
          title="Followers"
          description={followers.length.toString()}
          className="p-2 flex flex-col items-center justify-center text-center"
        />
        <BentoGridItem
          title="Following"
          description={following.length.toString()}
          className="p-2 flex flex-col items-center justify-center text-center"
        />
        <BentoGridItem
          title="Not Following Back"
          description={notFollowingBack.length.toString()}
          className="p-2 flex flex-col items-center justify-center text-center"
        />
        <BentoGridItem
          title="Mutual Follows"
          description={mutualFollows.length.toString()}
          className="p-2 flex flex-col items-center justify-center text-center"
        />
      </BentoGrid>

      <BentoGrid className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BentoGridItem
          title="Not Following Back"
          className="flex flex-col h-full"
          description={
            <div className="flex flex-col h-full">
              <PaginatedList
                title="Not Following Back"
                items={notFollowingBack}
                renderItem={(user) => (
                  <li key={user.id} className="flex items-center space-x-4">
                    <Image
                      src={user.avatar_url}
                      alt={`${user.login}'s avatar`}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <a
                        href={user.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {user.login}
                      </a>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => handleUnfollow(user.login)}
                    >
                      Unfollow
                    </Button>
                  </li>
                )}
              />
            </div>
          }
        />
        <BentoGridItem
          title="Mutual Follows"
          className="flex flex-col h-full"
          description={
            <div className="flex flex-col h-full">
              <PaginatedList
                title="Mutual Follows"
                items={mutualFollows}
                renderItem={(user) => (
                  <li key={user.id} className="flex items-center space-x-4">
                    <Image
                      src={user.avatar_url}
                      alt={`${user.login}'s avatar`}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <a
                        href={user.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {user.login}
                      </a>
                    </div>
                  </li>
                )}
              />
            </div>
          }
        />
      </BentoGrid>
    </div>
  );
};

export default Dashboard;
