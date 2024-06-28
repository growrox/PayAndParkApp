import React, { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../../components/dashboard/Home';
import AuthStack from './AuthStack';
import { useSelector } from 'react-redux';
// import { clearPersistedState } from '../../utils/clearPersistedState';
import DrawerNavigator from './Drawer/DrawerNavigator';
import PaymentDetails from '../../components/ticketScreens/PaymentDetails';
import VehicleType from '../../components/ticketScreens/VehicleType';
import TimeSlot from '../../components/ticketScreens/TimeSlot';
import VehiclePaymentEntry from '../../components/ticketScreens/VehiclePaymentEntry';


const Stack = createStackNavigator();


export default function Screens() {
    const { isAuthenticated } = useSelector(state => state.auth)

    const StackScreensAuthenticated = [
        {
            screen: "Home",
            component: Home
        },
        {
            screen: 'VehicleType',
            component: VehicleType
        },
        {
            screen: 'TimeSlot',
            component: TimeSlot
        },
        {
            screen: 'VehiclePaymentEntry',
            component: VehiclePaymentEntry
        },
        {
            screen: 'PaymentDetails',
            component: PaymentDetails
        }
    ]

    useEffect(() => {
        console.log('isAuthenticated', isAuthenticated);
        // clearPersistedState()
    }, [])


    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isAuthenticated == true ? (

                StackScreensAuthenticated.map((data, index) => {
                    console.log('StackScreensAuthenticated gets hit');
                    return (
                        <Stack.Screen
                            name={data.screen}
                            component={data.component}
                            options={{
                                headerShown: false,
                            }}
                            key={index + 1}
                        />
                    )
                })

            ) : (
                <>
                    {console.log('StackScreensAuthenticated not gets hit')}
                    <Stack.Screen
                        name="authStack"
                        component={AuthStack}
                        options={{
                            headerShown: false,
                        }}
                    />
                </>

            )}
        </Stack.Navigator>
    )
}

