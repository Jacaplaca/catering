// navigationLink.d.ts
export type NavigationLink = {
    identifier: string;
    url: string;
    anchor: string;
    hasChildren: boolean;
    isPage: boolean;
    children: {
        url: string;
        anchor: string;
    }[]
};
