import * as React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Image, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AUTH_LOG_OUT, ASSISTANT_CLOCK } from '../../redux/types';
import { useToast } from 'react-native-toast-notifications';
import { url } from '../../utils/url';


const ProfileModal = ({ modalVisible, setModalVisible }) => {
    const { isClockedIn, userId, token, phoneNo, name } = useSelector(state => state.auth)
    const [isLoading, setLoading] = React.useState(false)
    const toast = useToast();
    const dispatch = useDispatch();

    const handleOutsidePress = () => {
        setModalVisible(false);
    };


    const handleClockin = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${url}/api/v1/attendance/clock-in/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-client-source': 'app',
                },
            });

            const data = await response.json();
            // console.log('clockin data', data);
            if (response.status === 200) {
                dispatch({
                    type: ASSISTANT_CLOCK,
                    payload: {
                        isClockedIn: true,
                    }
                });
                toast.show(data.message, { type: 'success', placement: 'top' });
                // console.log("data.message success", data.message);
            } else if (response.status === 401 || response.status === 406) {
                dispatch({
                    type: AUTH_LOG_OUT,
                    payload: {
                        token: "",
                        location: "",
                        roleid: "",
                        phoneNo: "",
                        userId: "",
                        name: ""
                    }
                });
            } else {
                const toastType = response.status >= 400 ? 'danger' : 'warning';
                const messageData = response.status >= 400 ? data.error : data.message
                // console.log('messageData', messageData);
                toast.show(messageData, { type: toastType, placement: 'top' });
                // console.log('response.status data.message  data.error', response.status, data.message, data.error)
            }
        } catch (error) {
            toast.show(`Error: ${error.message}`, { type: 'danger', placement: 'top' });
            console.log('error.message', error.message);
        } finally {
            setLoading(false)
        }
    }


    const handleClockOut = async () => {
        setLoading(true)

        try {

            const response = await fetch(`${url}/api/v1/attendance/clock-out/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-client-source': 'app',
                    'userId': userId,
                    'Authorization': `Bearer ${token}`
                },
            });

            const data = await response.json();
            // console.log('clockout data', data);
            if (response.status === 200) {
                dispatch({
                    type: ASSISTANT_CLOCK,
                    payload: {
                        isClockedIn: false,
                    }
                });
                toast.show(data.message, { type: 'success', placement: 'top' });
            } else if (response.status === 401 || response.status === 406) {
                dispatch({
                    type: AUTH_LOG_OUT,
                    payload: {
                        token: "",
                        location: "",
                        roleid: "",
                        phoneNo: "",
                        userId: "",
                        name: ""
                    }
                });
            } else {
                const toastType = response.status >= 400 ? 'danger' : 'warning';
                const messageData = response.status >= 400 ? data.error : data.message
                // console.log('messageData', messageData);
                toast.show(messageData, { type: toastType, placement: 'top' });
                // console.log('response.status data.message  data.error', response.status, data.message, data.error)
            }
        } catch (error) {
            toast.show(`Error: ${error.message}`, { type: 'danger', placement: 'top' });
            console.log('data.message error', error.message)

        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        // console.log('Logged out');
        setModalVisible(false);
        dispatch({
            type: AUTH_LOG_OUT,
            payload: {
                token: "",
                location: "",
                roleid: "",
                phoneNo: "",
                userId: "",
                name: ""
            },
        });
        toast.show('You are logged out successfully!', { type: 'warning' });
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <TouchableWithoutFeedback onPress={handleOutsidePress}>
                <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback onPress={() => { }}>
                        <View style={styles.modalContent}>
                            <View style={styles.header}>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.profileTitle}>Profile</Text>
                                    <Text style={styles.assistanceTitle}>ASSISTANT</Text>
                                </View>
                                <View style={styles.rightHeader}>
                                    <TouchableOpacity
                                        style={{ ...styles.statusButton, borderColor: isClockedIn ? '#28a745' : '#c71f1f' }}
                                        onPress={() => { }}
                                    >
                                        <Text style={{ ...styles.statusText, color: isClockedIn ? '#28a745' : '#c71f1f', }}>{isClockedIn ? 'Online' : 'Offline'}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={() => setModalVisible(!modalVisible)}
                                    >
                                        <Text style={styles.closeButtonText}>✕</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.horizontalLine} />

                            <Text style={styles.profileName}>{name}</Text>
                            <View style={styles.phoneNumberContainer}>
                                <Image
                                    source={require('../../utils/images/homeAssistant/telephone.png')}
                                    style={styles.phoneIcon}
                                />
                                <Text style={styles.phoneNumber}>{phoneNo}</Text>
                            </View>

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={{ ...styles.clockInButton, backgroundColor: isClockedIn ? '#c71f1f' : '#28a745', }}
                                    disabled={isLoading}
                                    onPress={() => {
                                        isClockedIn ? handleClockOut() : handleClockin()
                                    }}
                                >
                                    {isLoading ? <ActivityIndicator size="small" color="#fff" /> :
                                        <Text disabled={isLoading} style={styles.clockInText}>{isClockedIn ? 'Clock Out' : 'Clock In'}</Text>}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.logoutButton}
                                    onPress={handleLogout}
                                >


                                    <Text style={styles.logoutButtonText}>Log Out</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 8,
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingVertical: 10,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    assistanceTitle: {
        fontSize: 12,
        color: '#212121',
        fontWeight: '500',
        marginLeft: 5,
        marginTop: 4,
    },
    rightHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusButton: {
        borderWidth: 1.5,
        paddingLeft: 6,
        paddingBottom: 1,
        paddingRight: 6,
        paddingTop: 1,
        borderRadius: 10,
        marginLeft: 10,
        marginTop: 4
    },
    statusText: {
        fontWeight: '500',
        fontSize: 11,
    },
    closeButton: {
        marginLeft: 4,
        padding: 5,
    },
    closeButtonText: {
        fontSize: 18,
        color: '#000',
    },
    horizontalLine: {
        width: '100%',
        height: 1.1,
        backgroundColor: 'grey',
        marginVertical: 10,
    },
    profileName: {
        fontSize: 22,
        fontWeight: '500',
        color: '#000',
        marginBottom: 4,
        marginTop: 5
    },
    phoneNumberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
    },
    phoneIcon: {
        width: 11,
        height: 11,
        marginRight: 5,
    },
    phoneNumber: {
        fontSize: 12,
        color: '#000',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        marginTop: 10,
        marginBottom: 5
    },
    clockInButton: {
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        width: '45%',
    },
    clockInText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: '#007bff',
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        width: '45%',
    },
    logoutButtonText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ProfileModal;
