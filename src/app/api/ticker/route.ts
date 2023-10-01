import { Ticker } from '@/types/coins/ticker.types';
import { NextRequest, NextResponse } from 'next/server';

export function GET(request: NextRequest, response: NextResponse) {
  try {
    const { Console } = require('console');
    const { WebsocketStream } = require('@binance/connector');

    const logger = new Console({ stdout: process.stdout, stderr: process.stderr });

    const callbacks = {
      open: () => logger.debug('Connected with Websocket server'),
      close: () => logger.debug('Disconnected with Websocket server'),
      message: (data: Ticker) => logger.info(data),
    };

    const websocketStreamClient = new WebsocketStream({ logger, callbacks });

    // all pairs
    // websocketStreamClient.ticker()

    // single pair
    const coin: Ticker = websocketStreamClient.ticker('bnbusdt');

    setTimeout(() => {
      websocketStreamClient.ticker('btcbusd');
    }, 300000);

    // ping server
    setTimeout(() => websocketStreamClient.pingServer(), 400000);

    setTimeout(() => websocketStreamClient.disconnect(), 600000);

    return new Response(JSON.stringify(coin));
  } catch (error) {
    console.error(error);
    // Handle errors and return an error response
    return new Response('Could not connect to Ticker. Please try again or contact support', { status: 503 });
  }
}
