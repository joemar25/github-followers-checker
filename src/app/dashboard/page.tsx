"use client";

import { useSession } from "next-auth/react";
import useSWR from "swr";
import axios from "axios";
import { useState, useMemo } from "react";
import { GitHubUser } from "@/types/github";
import PaginatedList from "@/components/dashboard/paginated-list";
import Logout from "@/components/auth/logout";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Users, UserCheck, UserMinus, HeartHandshake } from "lucide-react";

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
  <li className="flex items-center justify-between p-3 rounded-xl border border-border/30 bg-card/30 hover:bg-accent/40 hover:border-border/60 transition-all duration-300 group">
    <div className="flex items-center space-x-3">
      <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border/50 transition-all duration-300 group-hover:border-primary/30">
        <Image
          src={user.avatar_url}
          alt={`${user.login}'s avatar`}
          fill
          className="object-cover"
          sizes="40px"
        />
      </div>
      <div>
        <a
          href={user.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground hover:text-primary transition-colors text-sm hover:underline"
        >
          {user.login}
        </a>
        <p className="text-[10px] text-muted-foreground">GitHub Profile</p>
      </div>
    </div>
    {showUnfollow && onUnfollow && (
      <Button
        variant="outline"
        size="sm"
        onClick={() => onUnfollow(user.login)}
        disabled={isUnfollowing}
        className="rounded-full text-xs font-medium border-border hover:bg-destructive hover:text-destructive-foreground hover:border-destructive/20 h-8 px-3 transition-all duration-200 active:scale-[0.96]"
      >
        {isUnfollowing ? (
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Unfollowing
          </span>
        ) : (
          "Unfollow"
        )}
      </Button>
    )}
  </li>
);

const Dashboard: React.FC = () => {
  const { data: session, status } = useSession({ required: true });
  const [unfollowing, setUnfollowing] = useState<Set<string>>(new Set());

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
      <div className="mx-auto max-w-7xl p-6 md:p-8 space-y-8 min-h-screen bg-background text-foreground animate-pulse">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center pb-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-muted rounded-full" />
            <div className="space-y-2">
              <div className="h-6 w-32 bg-muted rounded" />
              <div className="h-3.5 w-44 bg-muted rounded" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-9 bg-muted rounded-full" />
            <div className="h-9 w-20 bg-muted rounded-lg" />
          </div>
        </div>
        
        {/* Bento Grid Skeleton */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-muted/50 rounded-2xl border border-border/45 p-5 flex flex-col justify-between" />
          ))}
        </div>
        
        {/* Lists Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="border border-border/50 bg-card rounded-2xl p-6 space-y-4">
              <div className="h-6 w-32 bg-muted rounded mx-auto" />
              <div className="space-y-3 pt-4 border-t border-border/30">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="flex items-center justify-between p-3 border border-border/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-muted rounded-full" />
                      <div className="space-y-1.5">
                        <div className="h-4 w-24 bg-muted rounded" />
                        <div className="h-3 w-16 bg-muted rounded" />
                      </div>
                    </div>
                    <div className="h-8 w-16 bg-muted rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (status !== "authenticated") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 text-center">
        <div className="max-w-md space-y-4">
          <p className="text-lg font-semibold text-destructive">Authentication Required</p>
          <p className="text-sm text-muted-foreground">You are not authenticated. Please return to the login page to sign in.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6 md:p-8 space-y-8 bg-background text-foreground min-h-screen">
      <Toaster richColors position="bottom-right" />
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-border/50 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-3.5">
          {session?.user?.image ? (
            <div className="relative h-12 w-12 rounded-full border-2 border-primary/20 overflow-hidden shadow-md">
              <Image 
                src={session.user.image} 
                alt={session.user.name || "User"} 
                fill 
                className="object-cover"
                sizes="48px"
              />
            </div>
          ) : (
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
              {session?.user?.name?.[0]?.toUpperCase() || "U"}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Hello, {session?.user?.name || "Developer"}
            </h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Connected to GitHub API
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 self-end md:self-auto">
          <Link href="/docs">
            <Button variant="outline" className="rounded-full text-xs font-medium border-border hover:bg-accent transition-all duration-300">
              Docs
            </Button>
          </Link>
          <ModeToggle />
          <Logout />
        </div>
      </header>

      {/* Stats Bento Grid */}
      <BentoGrid className="grid grid-cols-2 gap-4 md:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        <BentoGridItem
          title="Followers"
          description={
            <div className="pt-2">
              <span className="text-3xl font-extrabold text-foreground tracking-tight">{followers.length}</span>
              <p className="text-[10px] text-muted-foreground mt-1">Users following you</p>
            </div>
          }
          icon={<Users className="h-5 w-5 text-primary" />}
          className="p-5 flex flex-col justify-between"
        />
        <BentoGridItem
          title="Following"
          description={
            <div className="pt-2">
              <span className="text-3xl font-extrabold text-foreground tracking-tight">{following.length}</span>
              <p className="text-[10px] text-muted-foreground mt-1">Users you follow</p>
            </div>
          }
          icon={<UserCheck className="h-5 w-5 text-primary" />}
          className="p-5 flex flex-col justify-between"
        />
        <BentoGridItem
          title="Not Following Back"
          description={
            <div className="pt-2">
              <span className="text-3xl font-extrabold text-foreground tracking-tight">{notFollowingBack.length}</span>
              <p className="text-[10px] text-muted-foreground mt-1">{"Don't follow you back"}</p>
            </div>
          }
          icon={<UserMinus className="h-5 w-5 text-destructive/80" />}
          className="p-5 flex flex-col justify-between"
        />
        <BentoGridItem
          title="Mutual Follows"
          description={
            <div className="pt-2">
              <span className="text-3xl font-extrabold text-foreground tracking-tight">{mutualFollows.length}</span>
              <p className="text-[10px] text-muted-foreground mt-1">Mutual connections</p>
            </div>
          }
          icon={<HeartHandshake className="h-5 w-5 text-emerald-500" />}
          className="p-5 flex flex-col justify-between"
        />
      </BentoGrid>

      {/* Main Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
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
      </div>
    </div>
  );
};

export default Dashboard;