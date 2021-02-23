import React from 'react';
import 'react-native-gesture-handler';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();
const Tabs = () => {

    return (
      <Tab.Navigator
        //initialRouteName="ComandaScreen"
        tabBarOptions={{
          activeBackgroundColor:'#fff',
          activeTintColor: '#ffffff',
          inactiveTintColor: '#3F51B5',
          style: {
            backgroundColor: '#3F51B5',
          },
          
          labelStyle: {
            textAlign: 'center',
            fontSize: 18,
            margin:0,
            color:'#000',
          },
        }}
        >
        <Tab.Screen
          name="ComandaScreen"
          component={Comanda}
          options={{
            tabBarLabel: 'Usuario - local',
            tabBarColor: '#000',
          }}
        />
      </Tab.Navigator>
    );
  }

  export default Tabs;