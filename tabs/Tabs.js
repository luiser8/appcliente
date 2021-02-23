import React, { useState, useEffect, useMemo} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Carrito from '../components/Carrito/Carrito';
import Cuenta from '../components/Cuenta/Cuenta';
import Pedido from '../components/Pedido/Pedido';
import Productos from '../components/productos/Productos';
import { CountContext } from '../utils/Count';

const Tab = createBottomTabNavigator();

const Tabs = (props) => {
  var [count, setCount] = useState(0);

  const checkItems = async () => {
      let item; 
      try {
        item = await AsyncStorage.getItem('Count'); setCount(item);
      }catch(e){
        console.log(e); setCount(0);
      } 
      setCount(item);
  }

  const countContext = useMemo(() => ({
    countItems: async (items) => {
      let item = String(items);
      try {
        setCount(item); await AsyncStorage.setItem('Count', item);
      }catch(e){
        console.log(e); setCount(0);
      }
    }
  }), []);
  
useEffect(() => {
  checkItems();
}, []);

  return (
    <CountContext.Provider value={countContext} key={count}>
    <Tab.Navigator
      initialRouteName="Productos"
      screenOptions={{
        unmountOnBlur: false,
      }}
      tabBarOptions={{
        activeTintColor: 'blue',
      }}
    >
      <Tab.Screen
        name="Productos"
        component={Productos}
        options={{ 
          tabBarLabel: 'Productos',
          tabBarIcon: ({ color, size }) => (
            <Icon name={'tags'} color={color} size={size} />
          ),
        }}
      />
      
        <Tab.Screen
                name="Carrito"
                component={Carrito}
                options={{
                  tabBarLabel: 'Carrito',
                  tabBarIcon: ({ color, size }) => (
                    <Icon name={'shopping-cart'} color={color} size={size} {...props} />
                  ),
                  tabBarBadge: count,
                }}
              />

      <Tab.Screen
        name="Pedido"
        component={Pedido}
        options={{
          tabBarLabel: 'Pedido',
          tabBarIcon: ({ color, size }) => (
            <Icon name={'shopping-bag'} color={color} size={size} />
          ),
        }}
      />
    <Tab.Screen
        name="Cuenta"
        component={Cuenta}
        options={{
          tabBarLabel: 'Cuenta',
          tabBarIcon: ({ color, size }) => (
            <Icon name={'user-alt'} color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
    </CountContext.Provider>
  );
}

export default Tabs;