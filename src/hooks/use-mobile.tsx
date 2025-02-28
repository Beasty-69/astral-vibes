
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    
    // Initial check
    setMatches(mediaQuery.matches)
    
    // Event listener function
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }
    
    // Add listener
    mediaQuery.addEventListener("change", handler)
    
    // Clean up
    return () => {
      mediaQuery.removeEventListener("change", handler)
    }
  }, [query])

  return matches
}

export function useIsMobile() {
  return useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
}
