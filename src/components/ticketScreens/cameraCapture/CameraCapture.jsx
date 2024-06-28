import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from "react-native-image-picker";
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';


export default function CameraCapture({ onCapture }) {



    const handleCapture = async () => {
        const options = {
            mediaType: 'photo',
            maxWidth: 300,
            maxHeight: 550,
            quality: 1,
            saveToPhotos: true,
        };

        let permissionStatus;
        if (Platform.OS === 'android') {
            permissionStatus = await request(PERMISSIONS.ANDROID.CAMERA);
        } else {
            permissionStatus = await request(PERMISSIONS.IOS.CAMERA);
        }

        if (permissionStatus === RESULTS.GRANTED) {
            // launchCamera = () => {
                let options = {
                    storageOptions: {
                        skipBackup: true,
                        path: 'images',
                    },
                };
                ImagePicker.launchCamera(options, (response) => {

                    if (response.didCancel) {
                        console.log('User cancelled image picker by pressing back button');
                    } else if (response.error) {
                        console.log('ImagePicker Error: ', response.error);
                    } else if (response.customButton) {
                        console.log('User selected custom button: ', response.customButton);
                        Alert.alert(response.customButton);
                    } else {
                        const source = { uri: response.uri };
                        console.log('response', JSON.stringify(response));
                        onCapture(response.assets[0].uri);                       
                        // this.setState({
                        //     filePath: response,
                        //     fileData: response.data,
                        //     fileUri: response.uri
                        // });
                    }
                });

            // }

        } else {
            Alert.alert('Camera Permission', 'Camera permission is required to take pictures.');
        }
    };


    return (
        <TouchableOpacity onPress={handleCapture} style={styles.button}>
            <Text style={styles.buttonText}>Click to capture the vehicle image</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#007bff',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginBottom: 26,
        marginTop: 6
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
});
