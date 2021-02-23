import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
} from 'react-native';
import '../../utils/Config';
import Zona from '../Zonas/Zona';

const Session = (props) => {
    return (
        <SafeAreaView style={styles.container}>
            <Zona openMap={props.open} />
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1 ,
        alignItems: 'center',
        justifyContent: 'center',
    },
  });
export default Session;
