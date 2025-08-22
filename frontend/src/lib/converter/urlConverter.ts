export function stringToURLFriendly(s: string | null | undefined): string {
    if (s) {
        return btoa(String.fromCharCode(...(new TextEncoder().encode(s))))
    }
    else {
        return ""
    }
}

export function urlToString(url: string | undefined): string {
    if (url) {
        const binary = atob(url);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return new TextDecoder().decode(bytes);
    }
    else {
        return ""
    }
}