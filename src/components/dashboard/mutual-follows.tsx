import { GitHubUser } from "@/types/github";
import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface MutualFollowsProps {
    users: GitHubUser[];
}

const MutualFollows = ({ users }: MutualFollowsProps) => {
    return (
        <Card className="shadow-sm mt-4">
            <CardHeader>
                <h2 className="text-lg font-semibold">Mutual Follows</h2>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                    {users.map((user) => (
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
                                    className="text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    {user.login}
                                </a>
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
};

export default MutualFollows;
