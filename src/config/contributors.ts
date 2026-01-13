export const contributors = [
    {
        name: "test1", // Contributor Name
        avatar: "https://cdn.imoscarz.me/avatar.png", // URL to Contributor Avatar Image
        subtitle: "developer", // Short Subtitle or Role
        profile: `123321`, // Short Profile Description (Markdown supported)
        url: "https://www.baidu.com", // URL to Contributor Profile (e.g., GitHub, personal website)
    },
    {
        name: "test2",
        avatar: "https://cdn.imoscarz.me/avatar.png",
        subtitle: "developer",
        profile: "developer",
        url: "",
    },
    {
        name: "test3",
        avatar: "https://cdn.imoscarz.me/avatar.png",
        subtitle: "developer",
        profile: "developer",
        url: "",
    },
] as const;

export type Contributor = (typeof contributors)[number];
