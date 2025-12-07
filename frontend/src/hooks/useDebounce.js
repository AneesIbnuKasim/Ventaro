import { useEffect } from "react"


export function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const handleTimer = setInterval(() => {
            setDebouncedValue(value)
        }, delay)

        return clearInterval(handleTimer)
    })
    return debouncedValue
}