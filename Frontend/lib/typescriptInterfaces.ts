export interface WOKCharacter {
  id: string; // uuid
  created_at: string; // timestamptz
  tier: string; // text
  color: string; // text
  luck: number; // float4
  owner_id: string; // uuid
  sprite: string; // text
  name: string; // text
  on_sale: boolean; // bool
  games_played: number; // int8
  games_won: number; // int8
  atk: number; // int8
  hp: number; // int8
  def: number; // int8
  image: string; // text
  token_id: string; // text
  owner_wallet: string; // text

  // Additional fields not in the original list but present in the interface
  owner_username?: string;
  price: number;
  currency: string;
}
