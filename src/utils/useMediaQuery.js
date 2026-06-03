import { useEffect, useState } from "react";

/**
 * @param {string} query - e.g. "(min-width: 800px)"
 * @param {boolean} [defaultValue=false] - SSR / first-paint default
 */
export default function useMediaQuery(query, defaultValue = false) {
    const [matches, setMatches] = useState(defaultValue);

    useEffect(() => {
        const media = window.matchMedia(query);
        const onChange = (e) => setMatches(e.matches);

        setMatches(media.matches);
        media.addEventListener("change", onChange);
        return () => media.removeEventListener("change", onChange);
    }, [query]);

    return matches;
}
