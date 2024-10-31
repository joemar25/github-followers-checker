"use client";

import { useSession } from "next-auth/react";
import useSWR from "swr";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { GitHubUser } from "@/types/github";
import PaginatedList from "@/components/dashboard/PaginatedList";
import Logout from "@/components/auth/logout";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";

const fetcher = (url: string) => axios.get(url).then(res => res.data);

interface UserListItemProps {
  user: GitHubUser;
  showUnfollow?: boolean;
  onUnfollow?: (username: string) => void;
  isUnfollowing?: boolean;
}

const UserListItem: React.FC<UserListItemProps> = ({
  user,
  showUnfollow,
  onUnfollow,
  isUnfollowing
}) => (
  <li className="flex items-center space-x-4 p-2">
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
    {showUnfollow && onUnfollow && (
      <Button
        variant="secondary"
        onClick={() => onUnfollow(user.login)}
        disabled={isUnfollowing}
      >
        {isUnfollowing ? "Unfollowing..." : "Unfollow"}
      </Button>
    )}
  </li>
);

const Dashboard: React.FC = () => {
  const { data: session, status } = useSession({ required: true });
  const [loadingDots, setLoadingDots] = useState<string>(".");
  const [unfollowing, setUnfollowing] = useState<Set<string>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingDots((prev) => (prev === "..." ? "." : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const { data: followers = [], isLoading: followersLoading } = useSWR<GitHubUser[]>(
    session ? "/api/followers" : null,
    fetcher,
    { refreshInterval: 60000 }
  );

  const { data: following = [], mutate: mutateFollowing, isLoading: followingLoading } = useSWR<GitHubUser[]>(
    session ? "/api/following" : null,
    fetcher,
    { refreshInterval: 60000 }
  );

  const handleUnfollow = async (username: string) => {
    if (unfollowing.has(username)) return;

    setUnfollowing((prev) => new Set(prev).add(username));
    try {
      await axios.delete(`/api/following/${username}`);
      mutateFollowing(
        following.filter((user) => user.login !== username),
        false
      );
      toast.success(`Successfully unfollowed ${username}`);
    } catch (error) {
      console.error(`Failed to unfollow ${username}`, error);
      toast.error(`Failed to unfollow ${username}. Please try again.`);
      mutateFollowing();
    } finally {
      setUnfollowing((prev) => {
        const newSet = new Set(prev);
        newSet.delete(username);
        return newSet;
      });
    }
  };

  const { notFollowingBack, mutualFollows } = useMemo(() => {
    const followerLogins = new Set(followers.map(user => user.login));
    return {
      notFollowingBack: following.filter(user => !followerLogins.has(user.login)),
      mutualFollows: followers.filter(user =>
        following.some(f => f.login === user.login)
      )
    };
  }, [followers, following]);

  if (status === "loading" || followersLoading || followingLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading{loadingDots}</p>
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
              <ul className="space-y-2">
                <PaginatedList
                  title="Not Following Back"
                  items={notFollowingBack}
                  renderItem={(user) => (
                    <UserListItem
                      key={user.id}
                      user={user}
                      showUnfollow
                      onUnfollow={handleUnfollow}
                      isUnfollowing={unfollowing.has(user.login)}
                    />
                  )}
                />
              </ul>
            </div>
          }
        />
        <BentoGridItem
          title="Mutual Follows"
          className="flex flex-col h-full"
          description={
            <div className="flex flex-col h-full">
              <ul className="space-y-2">
                <PaginatedList
                  title="Mutual Follows"
                  items={mutualFollows}
                  renderItem={(user) => (
                    <UserListItem
                      key={user.id}
                      user={user}
                    />
                  )}
                />
              </ul>
            </div>
          }
        />
      </BentoGrid>
    </div>
  );
};

export default Dashboard;