export const formatTime12Hour = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    if (!hours || !minutes) return timeStr;
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12; 
    return `${h}:${minutes} ${ampm}`;
};
