import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const AssistantHeader = ({ name, title }) => {
    return (
        <View style={styles.container}>
            <Image
                source={require('../../../utils/images/homeSupervisor/assistantPage/user.png')}
                style={styles.avatar}
            />
            <View style={styles.textContainer}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.title}>{title}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        backgroundColor: '#fff',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 25,
        marginRight: 10,
    },
    textContainer: {
        flexDirection: 'column',
    },
    name: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 11,
        color: 'grey',
    },
});

export default AssistantHeader;
