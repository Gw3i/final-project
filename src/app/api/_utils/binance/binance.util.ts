import axios from 'axios';

// Fetch Binance server time
export const getServerTime = async (): Promise<number> => {
  try {
    const response = await axios.get('https://api.binance.com/api/v3/time');
    return response.data.serverTime;
  } catch (error) {
    throw new Error('Failed to fetch server time from Binance API');
  }
};

export const generateTimestamp = async (): Promise<number> => {
  const serverTime = await getServerTime();
  const timestamp = serverTime + 1000;
  return timestamp;
};
