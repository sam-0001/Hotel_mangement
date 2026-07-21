import { useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setMyBookings } from '../redux/tableSlice';

function useGetMyBookings() {
    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.user);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!userData) return;
            try {
                const response = await axios.get(`${serverUrl}/api/table-booking/my-bookings`, { withCredentials: true });
                dispatch(setMyBookings(response.data));
            } catch (error) {
                console.log(error);
            }
        };

        fetchBookings();
    }, [userData]);
}

export default useGetMyBookings;
