import React, { useEffect, useState } from 'react';
import { Container, Content, Card, CardItem, Left} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    SafeAreaView, ActivityIndicator,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Image,
    TouchableOpacity,
    Dimensions, Button, ToastAndroid,
} from 'react-native';
import '../../utils/Config';
import Layout from '../Layout/Header';
import Info from '../info/Info';
import Ingresar from '../session/Ingresar';
import Session from '../session/Session';
import DatosFacturacion from '../Pedido/DatosFacturacion';

const Facturacion = (props) => {
    var deviceWidth = Dimensions.get('window').width;
    var deviceHeight = Dimensions.get('window').height;
    var [clienteId, setClienteId] = useState('');
    var [open, setOpen] = useState(false);
    var [datosFacturacion, setDatosFacturacion] = useState([]);
    var [openMap, setOpenMap] = useState(false);
    var [openInfo, setOpenInfo] = useState(false);
    var [openIngresar, setOpenIngresar] = useState(false);
    const screenHeight = Dimensions.get('window').height;
    var [openDatosFacturacion, setOpenDatosFacturacion] = useState(false);

    const establecer = async () => {
        let clienteId;
        try {
            clienteId = await AsyncStorage.getItem('ClienteId');
            setClienteId(clienteId);
            await getDatosFacturacion(clienteId);

        } catch (e) {
            console.log(e);
        }

    }
    const toast = (message, duration) => {
        ToastAndroid.show(message, ToastAndroid.BOTTOM)
    }

    const changeOpenMap = (open) => {
        setOpenMap(open); setOpen(open);
    }
    const changeOpenInfo = (open) => {
        setOpenInfo(open); setOpen(open);
    }
    const changeOpenIngresar = (open) => {
        setOpenIngresar(open); setOpen(open);
    }
    const changeOpenDatosFacturacion = (open, data) => {
        if(data){
            setOpenDatosFacturacion(open); setOpen(open);
        }else{
             setOpenDatosFacturacion(open); setOpen(open);
        }
    }
    //Consultamos lista de Productos disponibles desde el api
    const getDatosFacturacion = async (cliente) => {
        var result = await fetch(`${global.config.appConfig.url.dev}POC_DatosFacturacion?clienteId=${cliente}`, {
            method: 'GET',
            headers: global.config.appConfig.headers.dev,
            json: true
        }).then(response => {
            if (response.status >= 200 && response.status <= 299) {
                return response.json()
            } else { // si no se obtiene una respuesta
                response.json().then((json) => {
                    const { Message, StrackTraceString } = json;
                });
                return null
            }
        }).catch(e => console.log(e))
        if (result == null) {
            return "Error get";
        } else {
            return setDatosFacturacion(result)
        }
    }
//Cambios de estados, activado y desabilitado
const toggleEstado = async (id) => {
    await fetch(`${global.config.appConfig.url.dev}POC_DatosFacturacion/${id}`, {
        method: 'DELETE',
        headers: global.config.appConfig.headers.dev,
        json: true
    }).then(() => {
        fetch(`${global.config.appConfig.url.dev}POC_DatosFacturacion?clienteId=${clienteId}`)
            .then(response => response.json())
            .then(res => {
                return setDatosFacturacion(res)
            })
            .catch(e => console.log(e))
    }).catch(e => console.log(e));
}

    useEffect(() => {
        establecer();
    }, []);
    return (
        <SafeAreaView style={{ flex: 1, }}>
            <View style={{ flex: 1, marginTop: deviceHeight * 0.00, backgroundColor: '#fff' }}>
                {open ? (
                    <>
                        {openInfo ? (
                            <Info openInfo={changeOpenInfo} />
                        ) : (
                                <></>
                            )}
                        {openMap ? (
                            <Session open={changeOpenMap} />
                        ) : (
                                <></>
                            )}
                        {openIngresar ? (
                            <Ingresar openIngresar={changeOpenIngresar} />
                        ) : (
                                <></>
                            )}
                        {openDatosFacturacion ? (
                            <DatosFacturacion open={changeOpenDatosFacturacion} cliente={clienteId} />
                        ) : (
                            <></>
                        )}
                    </>
                ) : (
                        <>
                            <Layout openInfo={changeOpenInfo} openMap={changeOpenMap} openIngresar={changeOpenIngresar} />
                            <Text style={{ fontSize: 20, alignSelf: 'center' }}>Datos de Facturación</Text>
                            
                            <TouchableOpacity onPress={() => changeOpenDatosFacturacion(true)} style={{ alignItems:'flex-end', marginRight:12, marginTop:-28 }} >
                                
                                <Icon name={'plus-circle'} color="black" size={42} />

                           </TouchableOpacity>
                           
                            <Container style={styles.container}>

                                <View style={{ Height: "auto", maxHeight: screenHeight }}>
                                    {(Object.keys(datosFacturacion).length !== 0) ?
                                        
                                            <ScrollView>

                                                {datosFacturacion.map((key, item) => (
                                                    
                                                        <Card key={datosFacturacion[item].DatosFacturacionId} style={{ flex: 1 }}>
                                                        <CardItem>
                                                           
                                                            <Left>
                                                                <TouchableOpacity>
                                                                    
                                                                        
                                                                            <View key={datosFacturacion[item].CedulaRUC}>
                                                                                <Text style={styles.titulo}>Nombres y Apellidos {datosFacturacion[item].Nombres} {datosFacturacion[item].Apellidos}</Text>
                                                                                <Text style={styles.titulo}>Dirección {datosFacturacion[item].Direccion}</Text>
                                                                                <Text style={styles.titulo}>Telefono {datosFacturacion[item].Telefono}</Text>
                                                                                <Text style={styles.titulo}>Correo {datosFacturacion[item].Correo}</Text>
                                                                                
                                                                            </View>
    
                                                                </TouchableOpacity>

                                                            </Left>
                                                            
                                                            <TouchableOpacity style={{ marginLeft: 0 }} onPress={() => toggleEstado(datosFacturacion[item].DatosFacturacionId)}>
                                                                {datosFacturacion[item].Estado === 1 ? (
                                                                    <Icon name={'trash'} color="black" size={42} />
                                                                    ):(
                                                                    <Icon name={'trash-restore'} color="black" size={42} />
                                                                )}
                                                                
                                                            </TouchableOpacity>

                                                        </CardItem>

                                                    </Card>

                                                ))}
                                                <Card>

                                                    <TouchableOpacity>
                                                        <Button onPress={() => props.open(false)}  title={'Volver'}></Button>
                                                    </TouchableOpacity>
                                                </Card>
                                            </ScrollView>
                                        
                                        :
                                            <View style={{ flex: 1, marginTop: 140, alignItems:'center' }}>
                                                <Text>No hay datos de facturación</Text>
                                            </View>
                                       
                                    }
                                </View>

                            </Container>
                        </>
                    )}
            </View>
        </SafeAreaView>
    );
};

var deviceWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        padding: 14,
    },
    titulo: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    um: {
        fontSize: 14,
        color: '#000',
    },
    tiempo: {
        fontSize: 14,
        color: '#0d47a1',
    },
    rosa: {
        position: 'relative',
        width: deviceWidth * 0.23, //80
        elevation: 10,
        backgroundColor: "#fff",
        borderRadius: 0,
        paddingVertical: 20,
        paddingHorizontal: 10,
        textAlign: 'center',
        backgroundColor: '#fbe9e7',
    },
    verde: {
        position: 'relative',
        width: deviceWidth * 0.23, //80
        elevation: 10,
        backgroundColor: "#fff",
        borderRadius: 0,
        paddingVertical: 20,
        paddingHorizontal: 10,
        textAlign: 'center',
        backgroundColor: '#e8f5e9',
    },
    azul: {
        position: 'relative',
        width: deviceWidth * 0.23, //80
        elevation: 10,
        backgroundColor: "#fff",
        borderRadius: 0,
        paddingVertical: 20,
        paddingHorizontal: 10,
        textAlign: 'center',
        backgroundColor: '#e3f2fd',
    },
    amarillo: {
        position: 'relative',
        width: deviceWidth * 0.23, //80
        elevation: 10,
        backgroundColor: "#fff",
        borderRadius: 0,
        paddingVertical: 20,
        paddingHorizontal: 10,
        textAlign: 'center',
        backgroundColor: '#fff3e0',
    },
    appButtonText: {
        fontSize: 14,
        color: "#000",
        alignSelf: "center",
        alignItems: 'center',
        margin: -16,
        fontWeight: 'bold'
    }
});

export default Facturacion;
