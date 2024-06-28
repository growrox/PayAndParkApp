import React, { useEffect, useState } from 'react';
import { Text, View, Image, ImageBackground, Dimensions, StyleSheet, Keyboard } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function MainComponent({ children, Title, Description }) {
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

    const handleKeyboardDidShow = () => setIsKeyboardOpen(true);
    const handleKeyboardDidHide = () => setIsKeyboardOpen(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', handleKeyboardDidShow);
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide);

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    return (
        <View style={styles.container}>
            <View style={[styles.logoContainer, { marginTop: isKeyboardOpen ? 0 : 10 }]}>
                <Image
                    source={require('../../utils/images/Logo.png')}
                    style={[
                        styles.logo,
                        isKeyboardOpen && { width: 150, height: 150, marginTop: 10 }
                    ]}
                />
            </View>
            <ImageBackground
                source={require('../../utils/images/BackgroundUnauth.png')}
                style={[
                    styles.background,
                    !isKeyboardOpen && { flex: 1 }
                ]}
            >
                <View style={styles.contentContainer}>
                    <Text style={[styles.title, { fontSize: width * 0.1 }]}>{Title}</Text>
                    <Text style={[styles.description, { fontSize: width * 0.03 }]}>{Description}</Text>
                    {children}
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: -40,
        marginTop: 10,
    },
    logo: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        marginTop: 20
    },
    background: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    contentContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    title: {
        color: 'white',
        fontWeight: '900',
        marginBottom: 1.2,
        marginTop: 20
    },
    description: {
        color: 'white',
        marginBottom: 50,
    },
});
