const colors = require('tailwindcss/colors');

delete colors['lightBlue'];
delete colors['warmGray'];
delete colors['trueGray'];
delete colors['coolGray'];
delete colors['blueGray'];

module.exports = {
  content: [
    './public/**/*.html',
    './public/*.html',
    './src/**/*.tsx',
    './src/*.tsx',
    './src/**/*.html',
    './src/*.html',
    './public/**/*.js',
    './public/*.js',
  ],
  theme: {
    colors: {
      ...colors,
    },
    extend: {
      fontSize: {
        35: '35rem',
        55: '55rem',
      },
      opacity: {
        80: '.8',
      },
      zIndex: {
        2: 2,
        3: 3,
      },
      inset: {
        '-100': '-100%',
        '-225-px': '-225px',
        '-160-px': '-160px',
        '-150-px': '-150px',
        '-94-px': '-94px',
        '-50-px': '-50px',
        '-29-px': '-29px',
        '-20-px': '-20px',
        '25-px': '25px',
        '40-px': '40px',
        '50-px': '50px',
        '60-px': '60px',
        '75-px': '75px',
        '85-px': '85px',
        '95-px': '95px',
        '115-px': '115px',
        '145-px': '145px',
        '185-px': '185px',
        '195-px': '195px',
        '210-px': '210px',
        '260-px': '260px',
      },
      height: {
        '95-px': '95px',
        '70-px': '70px',
        '350-px': '350px',
        '500-px': '500px',
        '600-px': '600px',
      },
      minHeight: {
        '100-px': '100px',
        '280-px': '280px',
      },
      maxHeight: {
        '100-px': '100px',
        '110-px': '110px',
        '860-px': '860px',
      },
      minWidth: {
        '45-px': '45px',
        '80-px': '80px',
        '100-px': '100px',
        '140-px': '140px',
        '300-px': '300px',
        48: '12rem',
      },
      maxWidth: {
        '80-px': '80px',
        '100-px': '100px',
        '120-px': '120px',
        '150-px': '150px',
        '180-px': '180px',
        '200-px': '200px',
        '210-px': '210px',
        '580-px': '580px',
      },
      backgroundSize: {
        full: '100%',
      },
      aria: {
        invalid: 'invalid=true',
      },
      keyframes: {
        'slide-down': {
          '0%': {
            transform: 'translate3d(0, -100%, 0)',
          },
          '100%': {
            transform: 'translate3d(0, 0, 0)',
          },
        },
        'slide-up': {
          '0%': {
            transform: 'translate3d(0, 0, 0)',
          },
          '100%': {
            transform: 'translate3d(0, -100%, 0)',
          },
        },
        'fade-in': {
          '0%': {
            opacity: 0,
          },
          '100%': {
            opacity: 1,
          },
        },
        'fade-in-down': {
          '0%': {
            opacity: 0,
            transform: 'translate3d(0, -100%, 0)',
          },
          '100%': {
            opacity: 1,
            transform: 'translate3d(0, 0, 0)',
          },
        },
        'fade-out': {
          '0%': {
            opacity: 1,
          },
          '100%': {
            opacity: 0,
          },
        },
      },
      animation: {
        slidedown: 'slide-down 0.2s ease-in',
        slideup: 'slide-up 0.2s ease-in',
        fadein: 'fade-in 0.3s ease-in',
        fadeindown: 'fade-in-down 0.3s ease-in',
        fadeout: 'fade-out 0.3s ease-in',
      },
      transitionProperty: {
        maxheight: 'max-height',
      },
      // v3.x migration
      colors: {
        current: 'currentColor',
        green: colors.emerald,
        yellow: colors.amber,
        purple: colors.violet,
        blueGray: colors.slate,
        lightBlue: colors.sky,
        warmGray: colors.stone,
        trueGray: colors.neutral,
        coolGray: colors.gray,
        // Coredata brand
        coredataBlue: '#3d91fc',
        coredataViolet: '#5E72E4',
        fgMain: '#3d91fc',
        fgSecond: '#5E72E4',
      },
    },
  },
  plugins: [],
};
