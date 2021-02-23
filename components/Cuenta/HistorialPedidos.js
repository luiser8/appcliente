import React, { useEffect, useState } from 'react';
import { Container, Content, Card, CardItem, Left, Thumbnail, Body, Right } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Moment, { locales } from 'moment';
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

const HistorialPedidos = (props) => {
    var deviceWidth = Dimensions.get('window').width;
    var deviceHeight = Dimensions.get('window').height;
    var [clienteId, setClienteId] = useState('');
    var [clienteId, setClienteId] = useState('');
    var [open, setOpen] = useState(false);
    var [pedidos, setPedidos] = useState([]);
    var [openMap, setOpenMap] = useState(false);
    var [openInfo, setOpenInfo] = useState(false);
    var [openIngresar, setOpenIngresar] = useState(false);
    const screenHeight = Dimensions.get('window').height;
    const CARD_WIDTH = Dimensions.get('window').width * 1
    const CARD_HEIGHT = Dimensions.get('window').height * 1
    const SPACING_FOR_CARD_INSET = Dimensions.get('window').width * 0.1 - 40

    const establecer = async () => {
        let clienteId;
        try {
            clienteId = await AsyncStorage.getItem('ClienteId');
            setClienteId(clienteId);
            await getPedidos(clienteId);

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

    //Consultamos lista de Productos disponibles desde el api
    const getPedidos = async (cliente) => {
        var result = await fetch(`${global.config.appConfig.url.dev}POC_Pedido?clienteId=${cliente}`, {
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
            return promise(result)
        }
    }

    const promise = async (req) => {
        setPedidos(req);
        (await Promise.all([req])).map((items) => {
                items.forEach((item) => {
                    
                    item.POC_DetallePedido.forEach((dp) => {
                        // alert(JSON.stringify(dp.FechaHoraEntrega))
                        // alert(JSON.stringify(item.POC_DetallePedido.length))
                    })
                    
                })
                
        })
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
                    </>
                ) : (
                        <>
                            <Layout openInfo={changeOpenInfo} openMap={changeOpenMap} openIngresar={changeOpenIngresar} />
                            <Text style={{ fontSize: 20, alignSelf: 'center' }}>Historial de Pedidos</Text>
                            <Container style={styles.container}>

                                <View style={{ Height: "auto", maxHeight: screenHeight }}>
                                    {(Object.keys(pedidos).length !== 0) ?
                                        
                                            <ScrollView>

                                                {pedidos.map((key, item) => (
                                                    
                                                        <Card key={pedidos[item].PedidoId} style={{ flex: 1 }}>
                                                        <CardItem>
                                                           
                                                            <Left>
                                                                <TouchableOpacity>
                                                                    <Body>
                                                                        
                                                                        {/* {pedidos[item].POC_DetallePedido.map((key, dp) => ( */}
                                                                            <View key={pedidos[item].POC_DetallePedido[0]}>
                                                                                <Text style={styles.titulo}>Pedido #{pedidos[item].NroPedido}</Text>
                                                                                <Text>Entrega: {Moment(pedidos[item].POC_DetallePedido[0].FechaHoraEntrega).format('DD-MM-YYYY LT')}</Text>
                                                                                <Text>{Number.parseFloat(pedidos[item].POC_DetallePedido.length)} Items</Text> 
                                                                                <Text style={styles.um}>Valor a pagar: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(pedidos[item].ValorTotal)}</Text>
                                                                            </View>
                                                                         {/* ))} */}
                                                                        
                                                                    </Body>
                                                                </TouchableOpacity>
                                                               
                                                            </Left>
                                                            <TouchableOpacity onPress={() => alert(pedidos[item])}>
                                                                <Icon name={'chevron-right'} color="black" size={44} />
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
                                                <Text>No hay pedidos realizados aún, busca tus productos y empieza a pedir</Text>
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

export default HistorialPedidos;
