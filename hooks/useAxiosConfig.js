export default function useAxiosConfig() {
    const token = localStorage.getItem('vtNw6cNcqEqD');
    const config = {
        headers: {
            "Content-Type": "application-json",
            Authorization: `Bearer ${token}`
        }
    }
    return config;
}