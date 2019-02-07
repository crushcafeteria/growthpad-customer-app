export const config = {
    url: 'https://growthpad.irenkenya.com/api/',
    // url: 'http://127.0.0.1:17000/api/',
    // url: 'http://192.168.43.15:17000/api/',
    app: {
        name: 'IREN Growthpad'
    },
    password_reset_link: 'https://growthpad.irenkenya.com/password/reset',
    mapquest_key: '1c2mUWBZ2XAbTqI4elBLSMLkSG9Nc0iW',
    genders: {
        M: 'Male',
        F: 'Female'
    },

    default_radius: 20, // in kilometres

    catering: {
        event_types: {
            WEDDING: 'Wedding party',
            FUNERAL: 'Funeral ceremony',
            GRADUATION: 'Graduation Party',
            BIRTHDAY: 'Birthday Party',
            FAMILY: 'Family Gathering',
            CORPORATE: 'Corporate Event'
        },
        venues: {
            INDOOR: 'Indoor Event',
            OUTDOOR: 'Outdoor Event',
        }
    }
};

export default config;
