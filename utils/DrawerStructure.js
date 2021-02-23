import React, { useState, useEffect, useMemo } from 'react';
import 'react-native-gesture-handler';
import { ActivityIndicator, View, TouchableOpacity, Image, Platform, StatusBar, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const DrawerStructure = (props) => {

    const toggleDrawer = () => {
      props.navigationProps.toggleDrawer();
    };
  
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => toggleDrawer()}>
          <Icon name="bars" style={{marginLeft:10}} color="black" size={32} />
        </TouchableOpacity>
      </View>
    );
  }

  export default DrawerStructure;