import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const CustomCheckbox = ({ title, isChecked, onPress }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View
                style={[styles.checkbox, isChecked && styles.checkedCheckbox, isChecked ? { borderColor: '#007bff' } : { borderColor: '#ccc' }]}
            >
                {isChecked && <Image
                    source={require('../utils/images/check.png')}
                    style={styles.cardIcon}
                />
                }
            </View>
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 6,
        borderRadius: 5,
    },
    checkbox: {
        width: 18,
        height: 18,
        borderWidth: 2,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    checkedCheckbox: {
        backgroundColor: '#007bff',
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
    },
    cardIcon: {
        width: 13,
        height: 13,
    },
});

export default CustomCheckbox;
