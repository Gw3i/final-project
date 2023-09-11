import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  spacing: {
    0: '0',
    px: '0.1rem',
    0.5: '0.2rem',
    1: '0.4rem',
    1.5: '0.6rem',
    2: '0.8rem',
    2.5: '1rem',
    3: '1.2rem',
    3.5: '1.4rem',
    4: '1.6rem',
    5: '2rem',
    6: '2.4rem',
    7: '2.8rem',
    8: '3.2rem',
    9: '3.6rem',
    10: '4rem',
    11: '4.4rem',
    12: '4.8rem',
    14: '5.6rem',
    16: '6.4rem',
    20: '8rem',
    24: '9.6rem',
    28: '11.2rem',
    32: '12.8rem',
    36: '14.4rem',
    40: '16rem',
    44: '17.6rem',
    48: '19.2rem',
    52: '20.8rem',
    56: '22.4rem',
    60: '24rem',
    64: '25.6rem',
    72: '28.8rem',
    80: '32rem',
    96: '38.4rem',
  },
  plugins: [],
};
export default config;
