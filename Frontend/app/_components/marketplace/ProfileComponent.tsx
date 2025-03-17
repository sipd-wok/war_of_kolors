import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  user_id: string;
  username: string;
}

interface Character {
  image: string;
  id: number;
  name: string;
  sprite: string;
  created_at: string;
  tier: string;
  luck: number;
  color: string;
}

const ProfileComponent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const navigate = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/getUser");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          console.error("Failed to fetch user");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const fetchCharacters = async () => {
      try {
        const response = await fetch("/api/getCharacters");
        if (response.ok) {
          const data = await response.json();
          setCharacters(data.characters);
        } else {
          console.error("Failed to fetch characters");
        }
      } catch (error) {
        console.error("Error fetching characters:", error);
      }
    };

    const handleNavigation = () => {
      navigate.push("/profile");
    };

    window.addEventListener("go-to-profile", handleNavigation);

    fetchUser();
    fetchCharacters();

    return () => {
      window.removeEventListener("go-to-profile", handleNavigation);
    };
  }, [navigate]);

  const fetchOwnedCharacters = async () => {
    try {
      const response = await fetch("/api/getCharacters");
      if (response.ok) {
        const data = await response.json();

        // Create mapped characters array
        const mappedCharacters: Character[] = data.characters.map(
          (char: Character) => ({
            id: char.id,
            image: char.image || "",
            name: char.name || "",
            sprite: char.sprite || "",
            created_at: char.created_at || "",
            tier: char.tier || "",
            luck: char.luck || 0,
            color: char.color || "",
          }),
        );

        setCharacters(mappedCharacters);
      } else {
        console.error("Failed to fetch characters");
      }
    } catch (error) {
      console.error("Error fetching characters:", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/getUser");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          console.error("Failed to fetch user");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const handleNavigation = () => {
      navigate.push("/profile");
    };

    window.addEventListener("go-to-profile", handleNavigation);

    fetchUser();
    fetchOwnedCharacters();

    return () => {
      window.removeEventListener("go-to-profile", handleNavigation);
    };
  }, [navigate]);

  const displayBestCharacters = () => {
    const tierOrder = ["Rainbow", "Gold", "Silver", "Bronze"];

    return [...characters].sort((a, b) => {
      const tierComparison =
        tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier);
      return tierComparison !== 0 ? tierComparison : b.luck - a.luck;
    });
  };

  return (
    <div className="flex flex-col items-center justify-start bg-gray-900 text-white p-6 overflow-y-auto h-full">
      <h1 className="text-3xl font-bold mb-4">Player Profile</h1>
      {user && (
        <p className="text-lg mb-6">
          Username: <span className="font-semibold">{user.username}</span>
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {displayBestCharacters().map((character) => (
          <div
            key={character.id}
            className="bg-gray-800 p-4 rounded-lg shadow-md text-center"
          >
            <div
              className="aspect-square bg-cover bg-center w-6/7 p-6"
              style={{
                backgroundImage: `url(${character.image || "assets/char_" + character.sprite.replace(/\D/g, "") + ".png"})`,
              }}
            ></div>
            <p className="mt-2 font-semibold">{character.name}</p>
            <p className="text-yellow-400">Luck: {character.luck}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileComponent;
