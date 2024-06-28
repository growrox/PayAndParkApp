import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import React from 'react'

export default function CustomDrawerContent(props) {
    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem
                label="Close Drawer"
                onPress={() => props.navigation.closeDrawer()}
            />
        </DrawerContentScrollView>
    );
}
