import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Bool "mo:core/Bool";
import Order "mo:core/Order";

actor {
  type PlayerEntry = {
    playerName : Text;
    level_1_completed : Bool;
    level_2_completed : Bool;
    level_3_completed : Bool;
    level_4_completed : Bool;
  };

  module PlayerEntry {
    public func compare(player1 : PlayerEntry, player2 : PlayerEntry) : Order.Order {
      Text.compare(player1.playerName, player2.playerName);
    };
  };

  let playerEntries = Map.empty<Text, PlayerEntry>();

  public func createProfile(playerName : Text) : async () {
    let playerEntry : PlayerEntry = {
      playerName;
      level_1_completed = false;
      level_2_completed = false;
      level_3_completed = false;
      level_4_completed = false;
    };
    playerEntries.add(playerName, playerEntry);
  };

  public func completeLevel(playerName : Text, level : Nat) : async () {
    let entry = switch (playerEntries.get(playerName)) {
      case (null) { Runtime.trap("Player does not exist") };
      case (?entry) { entry };
    };

    let newEntry : PlayerEntry = {
      playerName = entry.playerName;
      level_1_completed = entry.level_1_completed or level == 1;
      level_2_completed = entry.level_2_completed or level == 2;
      level_3_completed = entry.level_3_completed or level == 3;
      level_4_completed = entry.level_4_completed or level == 4;
    };

    playerEntries.add(playerName, newEntry);
  };

  public query func getProfile(playerName : Text) : async PlayerEntry {
    switch (playerEntries.get(playerName)) {
      case (null) { Runtime.trap("Player does not exist.") };
      case (?entry) { entry };
    };
  };

  public query func getAllPlayerEntries() : async [PlayerEntry] {
    playerEntries.values().toArray().sort();
  };
};
