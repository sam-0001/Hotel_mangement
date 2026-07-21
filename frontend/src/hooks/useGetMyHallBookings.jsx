import { useEffect, useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import { useSelector } from 'react-redux';

function useGetMyHallBookings() {
    const { userData } = useSelector(state => state.user);
    const [myHallBookings, setMyHallBookings] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!userData || userData.role !== 'user') return;
            setLoading(true);
            try {
                const response = await axios.get(`${serverUrl}/api/hall-booking/my-bookings`, { withCredentials: true });
                setMyHallBookings(response.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [userData]);

    return { myHallBookings, loading };
}

export default useGetMyHallBookings;
