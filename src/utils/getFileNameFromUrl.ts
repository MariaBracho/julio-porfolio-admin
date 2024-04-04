export const getFileNameFromUrl = (url: string) => {
    return url.split("/").at(-1);
};