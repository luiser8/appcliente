import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Image,
    TouchableOpacity,
    Dimensions, Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import '../../utils/Config';
import { AuthContext } from '../../utils/Context';

const Header = (props) => {
    const { signOut } = React.useContext(AuthContext);
    var [usuarioId, setUsuarioId] = useState(props.user);

    const establecer = async () => {
        try {
            await AsyncStorage.getItem('UsuarioId').then(
                (value) => {
                    if(value !== undefined){
                        setUsuarioId(value); 
                    }else{
                        setUsuarioId(null);  
                    }
                }
            );
            
        } catch (e) {
            console.log(e);
        }

    }
    const cerrarSesion = () => {
        signOut();
        establecer();
    }

useEffect(() => {
    establecer();
}, []);

    return (
        <>
            <View style={styles.container}>
                <View style={{marginBottom:5}}>
                    <View style={{ flex:1,flexDirection:'row', alignItems: 'flex-start', marginBottom: 0}}>
                        <Image width={77} height={10} source={global.config.appConfig.images.local2} />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent:'flex-end'}}>
                        <TouchableOpacity onPress={() => props.openMap(true)} style={{flexDirection:'column', alignItems:'center' }}>
                            <Icon name={'map-marker-alt'} color="black" size={34} />
                            <Text style={styles.title}>Ubicación</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => props.openInfo(true)} style={{flexDirection:'column', alignItems:'center' }}>
                            <Icon name={'info-circle'} color="black" size={34} />
                            <Text style={styles.title}>Info</Text>
                        </TouchableOpacity>
                        {usuarioId !== null ? (
                            <TouchableOpacity onPress={() => cerrarSesion()} style={{flexDirection:'column', alignItems:'center' }}>
                                <Icon name={'door-closed'} color="black" size={34} />
                                <Text style={styles.title}>Cerrar Sesión</Text>
                            </TouchableOpacity>
                            ):(
                            <TouchableOpacity onPress={() => props.openIngresar(true)} style={{flexDirection:'column', alignItems:'center' }}>
                                <Icon name={'door-open'} color="black" size={34} />
                                <Text style={styles.title}>Ingresar</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
            </>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 14,
        marginTop: 0
    },
    title: {
        fontSize:12,
    }
});

export default Header;
