"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { updateUsername } from "@/lib/auth/updateUsername";

interface WelcomeFormProps {
  session: Session | null;
}

export const WelcomeForm = ({ session }: WelcomeFormProps) => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    console.log("Session user:", JSON.stringify(session?.user, null, 2));
  }, [session?.user]);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Only update username if it's being set (input field is visible)
      if (!session?.user?.username || session.user.username === "") {
        // Call the server action to update the username
        await updateUsername(username);

        // Refresh the router to reflect the updated session
        router.refresh();
      }

      // Navigate to game page
      router.push("/MainGame");
    } catch (err: unknown) {
      console.error("Error updating username:", err);
      if (err instanceof Error) {
        setError(err.message || "Failed to update username");
      } else {
        setError("Failed to update username");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {!session?.user?.username || session.user.username === "" ? (
          <div>
            <label>Enter Username:</label>
            <Input
              name="username"
              placeholder="username"
              type="text"
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        ) : (
          <p className="text-center">{session?.user?.username}</p>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Play Game"}
        </Button>
      </form>
      <Button variant="outline" className="w-full" onClick={handleSignOut}>
        Sign Out
      </Button>
    </div>
  );
};
