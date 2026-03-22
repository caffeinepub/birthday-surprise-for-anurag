import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PlayerEntry {
    level_1_completed: boolean;
    level_3_completed: boolean;
    playerName: string;
    level_2_completed: boolean;
    level_4_completed: boolean;
}
export interface backendInterface {
    completeLevel(playerName: string, level: bigint): Promise<void>;
    createProfile(playerName: string): Promise<void>;
    getAllPlayerEntries(): Promise<Array<PlayerEntry>>;
    getProfile(playerName: string): Promise<PlayerEntry>;
}
