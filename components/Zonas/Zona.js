import { Container, Content, Card, CardItem, Input, Label, Item } from 'native-base';
import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Image,
    TouchableOpacity,
    Dimensions, PermissionsAndroid,
    Button, ToastAndroid, ActivityIndicator,
} from 'react-native';
import { Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import { AuthContext } from '../../utils/Context';
import '../../utils/Config';
import Map from './Map';
import Info from '../info/Info';

const Zona = (props) => {
    const { signIn } = React.useContext(AuthContext);
    var [clienteId, setClienteId] = useState('');
    var [userId, setUserId] = useState('');
    var [temporal, setTemporal] = useState('');
    var [latitude, setLatitude] = useState();
    var [longitude, setLongitude] = useState();
    var [latitudeDelta, setLatitudeDelta] = useState();
    var [longitudeDelta, setLongitudeDelta] = useState();
    var [direccion, setDireccion] = useState('');
    var [referencia, setReferencia] = useState('');
    var [errorLatitude, setErrorLatitude] = useState(false);
    var [errorLongitude, setErrorLongitude] = useState(false);
    var [errorDireccion, setErrorDireccion] = useState(false);
    var [errorReferencia, setErrorReferencia] = useState(false);
    var [region, setRegion] = useState();
    var [activity, setActivity] = useState(false);
    var [openInfo, setOpenInfo] = useState(false);
    var deviceWidth = Dimensions.get('window').width;
    var deviceHeight = Dimensions.get('window').height;

    const getUser = async () => {
        let userId;
        try {
            userId = await AsyncStorage.getItem('ClienteId');
            setUserId(userId);
        } catch (e) {
            console.log(e);
        }
        setUserId(userId);
    }

    const toast = (message, duration) => {
        ToastAndroid.show(message, ToastAndroid.BOTTOM)
    }

    const changeOpenInfo = (info) => {
        setOpenInfo(info);
    }

    const changePosition = (coords) => {
        setLatitude(coords.latitude); setLongitude(coords.longitude);
    }

    //Iniciaizamos los inputs para hacerles resets
const initialInputs = () => {
    setDireccion(''); setReferencia('');
}
//Agregamos datos al cliente y direccion de entrega preliminar
const addClienteDireccionEntrega = async () => {
    if (latitude !== '' && longitude !== '' && direccion !== '' && referencia !== '') {
    setActivity(true);
    await fetch(`${global.config.appConfig.url.dev}POC_Cliente`, {
        method: 'POST',
        headers: global.config.appConfig.headers.dev,
        body: JSON.stringify({
            'Latitude':latitude,
            'Longitude':longitude,
            'Direccion': direccion,
            'Referencia': referencia
        }),
        json: true
    }).then(response => {
        //alert(JSON.stringify(response))
        if (response.status >= 200 && response.status <= 299) {
            return setLogin(response.json())
        }
        else { // si no se obtiene una respuesta
            response.json().then((json) => {
                const { Message, StrackTraceString } = json;
                alert(JSON.stringify(json))
                //setMessages(Message);
                //toast(Message, 3000)
            });
            return null
        }
    }).catch(e => {console.log(e);});
    initialInputs();
    setTimeout(() => {
        setActivity(false);
    }, 3000)
}else{
    if(latitude === ''){
        setErrorLatitude(true)
        toast('Error debes establecer el latitude', 3000)
    }
    if(longitude === ''){
        setErrorLongitude(true)
        toast('Error debes establecer el longitude', 3000)
    }
    if(direccion === ''){
        setErrorDireccion(true)
        toast('Error debes establecer el direccion', 3000)
    }
    if(referencia === ''){
        setErrorReferencia(true)
        toast('Error debes establecer el referencia', 3000)
    }
    setTimeout(() => {
        setErrorLatitude(false); setErrorLongitude(false); setErrorDireccion(false);
        setErrorReferencia(false); 
    }, 3000)
}
}

const updateClienteDireccionEntrega = async () => {
    if (latitude !== '' && longitude !== '' && direccion !== '' && referencia !== '') {
        await fetch(`${global.config.appConfig.url.dev}POC_DireccionEntrega`, {
            method: 'POST',
            headers: global.config.appConfig.headers.dev,
            body: JSON.stringify({
                'ClienteId':userId,
                'Latitude':latitude,
                'Longitude':longitude,
                'Direccion': direccion,
                'Referencia': referencia
            }),
            json: true
        }).then(response => {
            if (response.status >= 200 && response.status <= 299) {
                return response.json()
            }
            else { // si no se obtiene una respuesta
                response.json().then((json) => {
                    const { Message, StrackTraceString } = json;
                    //setMessages(Message);
                    //toast(Message, 3000)
                });
                return null
            }
        }).catch(e => {console.log(e);});
        initialInputs(); props.openMap(false);
        setTimeout(() => {
            //setMessages('');setSuccess(false);
        }, 3000)
    }else{
        if(latitude === ''){
            setErrorLatitude(true)
            toast('Error debes establecer el latitude', 3000)
        }
        if(longitude === ''){
            setErrorLongitude(true)
            toast('Error debes establecer el longitude', 3000)
        }
        if(direccion === ''){
            setErrorDireccion(true)
            toast('Error debes establecer el direccion', 3000)
        }
        if(referencia === ''){
            setErrorReferencia(true)
            toast('Error debes establecer el referencia', 3000)
        }
        setTimeout(() => {
            setErrorLatitude(false); setErrorLongitude(false); setErrorDireccion(false);
            setErrorReferencia(false); 
        }, 3000)
    }
}
    //Recibe el request para obtener los datos a colocar en la session local
    const setLogin = async (req) => {
        (await Promise.all([req])).map((items) => {
            if (items) {
                    setClienteId(items.ClienteId);
                    setTemporal(items.Temporal);
                    signIn({
                        'Mapa':true,
                        'ClienteId': items.ClienteId
                    });
            } else {
                signIn({ 'ClienteId': items.ClienteId, 'Cliente': 'Cliente no existe' })
            }
        })
    }
    useEffect(() => {
        Geolocation.getCurrentPosition(info => {
            setLatitude(info.coords.latitude);
            setLongitude(info.coords.longitude);
            setRegion(info);
        }, error => alert(JSON.stringify(error) ,{enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}));
        getUser();
    }, [])

    return (
        <View style={{backgroundColor:'#fff'}}>
            {openInfo ? (
                <Info openInfo={changeOpenInfo} />
            ) : (
                    <>
                        <Container>
                            <View style={{ alignItems: 'center', marginTop: 12, marginBottom:10}}>
                                <Image width={477} height={89} resizeMode="stretch" resizeMethod="resize" source={global.config.appConfig.images.local2} />
                            </View>
                            <Divider style={{ backgroundColor: 'black' }} />
                            <Card transparent>
                                <CardItem>
                                    <View style={{ alignItems: 'center', marginTop: -10 }}>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>¿En que Zona estas?</Text>
                                        <Text>Deseamos conocer la ubicación para presentar los productos disponibles en la zona elegida. Tambien se mostrarán los que ofrecen retiro en tienda.</Text>
                                    </View>
                                </CardItem>
                            </Card>
                            <SafeAreaView>
                                <View style={{ height: deviceHeight * 0.1 }}>
                                    {region ? (
                                        <Map props={region} newPosition={changePosition} />
                                        ):(
                                        <></>
                                    )}
                                    
                                </View>

                            </SafeAreaView>

                        </Container>
                        {activity ? (
                            <View style={{ flex: 1, marginTop: 100 }}>
                                <ActivityIndicator animating size={98} color="blue" />
                            </View>
                        ) : (
                                <></>
                            )}
                            <Card>
                                <Item floatingLabel style={{ borderColor: "black" }}>
                                    <Label style={{marginTop:8}}>Dirección</Label>
                                    <Input placeholderTextColor="#666666" name="direccion" value={direccion} onChangeText={text => setDireccion(text)} />
                                </Item>

                                <Item floatingLabel style={{ borderColor: "black" }}>
                                    <Label style={{marginTop:8}}>Referencia</Label>
                                    <Input placeholderTextColor="#666666" name="referencia" value={referencia} onChangeText={text => setReferencia(text)} />
                                </Item>

                                <CardItem>
                                    <View style={{ flex: 1 }}>
                                        <Text onPress={() => changeOpenInfo(true)} style={{ textDecorationLine: 'underline', fontSize: 16 }}>¿Que es Pandemik?</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>

                                        <TouchableOpacity style={styles.appButtonContainer} onPress={() => userId ? updateClienteDireccionEntrega() : addClienteDireccionEntrega() /*props.openMap(false)*/}>
                                            <Text style={styles.appButtonText}>{userId ? 'Actualizar' : 'Continuar'}</Text>
                                        </TouchableOpacity>

                                        {userId ? (
                                            <TouchableOpacity style={styles.appButtonContainer} onPress={() => props.openMap(false) /*props.openMap(false)*/}>
                                                <Text style={styles.appButtonText}>{'Cerrar'}</Text>
                                            </TouchableOpacity>
                                            ):(
                                            <></>
                                        )}

                                    </View>

                                </CardItem>
                            </Card>
                    </>
                )}

        </View>
    );
};

const styles = StyleSheet.create({
    appButtonContainer: {
        elevation: 16,
        backgroundColor: "#fff",
        borderRadius: 18,
        paddingVertical: 12,
        paddingHorizontal: 28
    },
    appButtonText: {
        fontSize: 14,
        color: "#000",
        alignSelf: "center",
    }
});

export default Zona;
