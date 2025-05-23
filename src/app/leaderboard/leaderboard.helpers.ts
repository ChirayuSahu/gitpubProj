const defaultAvatars = [
  '/default-avatar-1.png',
  '/default-avatar-2.png',
  '/default-avatar-3.png',
];

export function getRandomAvatar() {
  const randomIndex = Math.floor(Math.random() * defaultAvatars.length);
  return defaultAvatars[randomIndex];
}

export const hardcodedUsers = [
          {
            username: "NovaBlaze",
            rating: 999,
            campaignLevel: 7,
            wins: 18,
            losses: 3,
            avatarUrl: "/avatars/nova.png",
          },
          {
            username: "EchoFury",
            rating: 982,
            campaignLevel: 6,
            wins: 22,
            losses: 4,
            avatarUrl: "/avatars/echo.png",
          },
          {
            username: "ShadowBolt",
            xpPoints: 945,
            campaignLevel: 5,
            wins: 20,
            losses: 5,
            avatarUrl: "/avatars/shadow.png",
          },
          {
            username: "CrimsonRider",
            rating: 921,
            campaignLevel: 4,
            wins: 17,
            losses: 6,
            avatarUrl: "/avatars/crimson.png",
          },
          {
            username: "FrostNova",
            rating: 899,
            campaignLevel: 3,
            wins: 14,
            losses: 7,
            avatarUrl: "/avatars/frost.png",
          },
          {
            username: "IronWolf",
            rating: 867,
            campaignLevel: 2,
            wins: 12,
            losses: 9,
            avatarUrl: "/avatars/ironwolf.png",
          },
          {
            username: "SkyRanger",
            rating: 843,
            campaignLevel: 2,
            wins: 10,
            losses: 10,
            avatarUrl: "/avatars/skyranger.png",
          },
          {
            username: "BlazeStrike",
            rating: 829,
            campaignLevel: 2,
            wins: 11,
            losses: 8,
            avatarUrl: "/avatars/blaze.png",
          },
          {
            username: "PhantomRush",
            xpPoints: 812,
            campaignLevel: 3,
            wins: 13,
            losses: 6,
            avatarUrl: "/avatars/phantom.png",
          },
          {
            username: "StormDrift",
            rating: 790,
            campaignLevel: 2,
            wins: 9,
            losses: 11,
            avatarUrl: "/avatars/storm.png",
          },
          {
            username: "ThunderCore",
            xpPoints: 775,
            campaignLevel: 2,
            wins: 8,
            losses: 12,
            avatarUrl: "/avatars/thunder.png",
          },
          {
            username: "VenomSpark",
            rating: 752,
            campaignLevel: 1,
            wins: 7,
            losses: 13,
            avatarUrl: "/avatars/venom.png",
          },
          {
            username: "AshBreaker",
            rating: 740,
            campaignLevel: 1,
            wins: 6,
            losses: 14,
            avatarUrl: "/avatars/ash.png",
          },
          {
            username: "VoidHunter",
            xpPoints: 730,
            campaignLevel: 1,
            wins: 5,
            losses: 15,
            avatarUrl: "/avatars/void.png",
          },
          {
            username: "IronSpectre",
            rating: 715,
            campaignLevel: 1,
            wins: 6,
            losses: 13,
            avatarUrl: "/avatars/spectre.png",
          },
          {
            username: "LavaGlide",
            rating: 700,
            campaignLevel: 1,
            wins: 5,
            losses: 14,
            avatarUrl: "/avatars/lava.png",
          },
          {
            username: "NightFalcon",
            rating: 688,
            campaignLevel: 1,
            wins: 4,
            losses: 16,
            avatarUrl: "/avatars/falcon.png",
          },
          {
            username: "PulseBlade",
            xpPoints: 671,
            campaignLevel: 1,
            wins: 3,
            losses: 17,
            avatarUrl: "/avatars/pulse.png",
          },
          {
            username: "ZenoDash",
            rating: 659,
            campaignLevel: 1,
            wins: 3,
            losses: 18,
            avatarUrl: "/avatars/zeno.png",
          },
          {
            username: "FlareWing",
            rating: 643,
            campaignLevel: 1,
            wins: 2,
            losses: 19,
            avatarUrl: "/avatars/flare.png",
          },
        ];
