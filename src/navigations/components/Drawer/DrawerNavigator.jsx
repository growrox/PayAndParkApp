import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../../../components/dashboard/Home';
import CreateTicket from '../../../components/ticketScreens/PaymentDetails';

import React from 'react'

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
    return (
        <Drawer.Navigator
            // drawerPosition="right"

        // drawerContent={(props) => <CustomDrawerContent {...props} />}
        // initialRouteName="Home"
        >
            {/* <Drawer.Screen name="Home" component={Home} /> */}
            {/* <Drawer.Screen name="CreateTicket" component={CreateTicket} /> */}

        </Drawer.Navigator>
    )
}
