import { TeamItem } from '../components/TeamLists';

export const geocodeAddresses = async (teams: TeamItem[], country: string) => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    const promises = teams.map(async (team: TeamItem) => {
        const address = `${team.venue.address}, ${team.venue.city}, ${country}`;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${key}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.results.length > 0) {
                const location = data.results[0].geometry.location;
                return { ...team, position: location };
            } else {
                return { ...team, position: null };
            }
        } catch (err) {
            console.error(`Failed to geocode ${address}`, err);
            return { ...team, position: null };
        }
    });

    const results = await Promise.all(promises);
    return results;
};
