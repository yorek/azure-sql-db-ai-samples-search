import { makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
    '@global': {
        '&body': {
            margin: 0,
            padding: 0,
            fontFamily: 'Roboto, sans-serif',
        },
    },
    appContainer: {
        width: '50%',
        margin: '50px auto',
        padding: '20px',
        backgroundColor: '#ffffff'
    },
    header: {
        fontFamily: 'Roboto, sans-serif',
        textAlign: 'center',
        marginBottom: '20px',
        lineHeight: '1.5',
    },
    title: {
        fontSize: '1.8rem',
        fontWeight: 'bold',
        color: '#0078D4',
    },
    subtitle: {
        fontSize: '1rem',
        color: '#5c5c5c',
    },
    sampleCount: {
        fontSize: '0.9rem',
        color: '#5c5c5c',
        marginTop: '5px',
    },
    resultCard: {
        marginBottom: '10px',
    },
    searchWrapper: {
        display: 'flex',
        width: '100%',
    },
    inputField: {
        flex: 1, // Ensures the input takes up all available space
        marginRight: '0', // No margin between the input and button
    },
    searchButton: {
        backgroundColor: '#0078D4',
        marginLeft: '5px', // No margin between input and button
    },
});

export default useStyles;