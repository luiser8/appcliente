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
import { CountContext } from '../../utils/Count';
import Info from '../info/Info';
import Ingresar from '../session/Ingresar';
import Session from '../session/Session';

const Carrito = ({navigation}) => {
    const { countItems } = React.useContext(CountContext);
    var deviceWidth = Dimensions.get('window').width;
    var deviceHeight = Dimensions.get('window').height;
    var [activity, setActivity] = useState(false);
    var [clienteId, setClienteId] = useState('');
    var [costoEnvio, setCostoEnvio] = useState();
    var [costoSinIva, setCostoSinIva] = useState();
    var [costoConIva, setCostoConIva] = useState();
    var [iva, setIva] = useState(0);
    var [total, setTotal] = useState();
    var [clienteId, setClienteId] = useState('');
    var [open, setOpen] = useState(false);
    var [carrito, setCarrito] = useState([]);
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
            await getCarrito(clienteId);

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
    const getCarrito = async (cliente) => {
        setActivity(true);
        var result = await fetch(`${global.config.appConfig.url.dev}POC_Pedido?clienteId=${cliente}&confirmacion=${0}`, {
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
            setActivity(false);
        if (result == null) {
            return "Error get";
        } else {
            return promise(result)
        }
        
    }
    //Cambios de estados, activado y desactivado
    const deleteItem = async (item) => {
        await fetch(`${global.config.appConfig.url.dev}POC_DetallePedido/${item}`, {
            method: 'DELETE',
            headers: global.config.appConfig.headers.dev,
            json: true
        }).then(() => {
            fetch(`${global.config.appConfig.url.dev}POC_Pedido?clienteId=${clienteId}&confirmacion=${0}`)
                .then(response => response.json())
                .then(res => {
                    return promise(res)
                })
                .catch(e => console.log(e))
        }).catch(e => console.log(e));
    }
    const promise = async (req) => {
        setCarrito(req);
        (await Promise.all([req])).map((items) => {
            if (items.length >= 1) {
                items.forEach((item) => {
                    setCostoEnvio(item.CostoEnvio);
                    setCostoConIva(item.ConIva);
                    setCostoSinIva(item.TotalSinIva);
                    setTotal(item.ValorTotal);
                    setIva(item.Iva); 
                })
            } else if (items.length === 0) {
                setActivity(false);
            }
            countItems(items.length); 
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
                            <Text style={{ fontSize: 20, alignSelf: 'center' }}>Carrito de Compras</Text>
                            <Container style={styles.container}>

                                <View style={{ Height: "auto", maxHeight: screenHeight }}>
                                    {(Object.keys(carrito).length !== 0) ?
                                        
                                            <ScrollView>

                                                {carrito.map((key, item) => (
                                                    <Card key={item} style={{ flex: 1 }}>
                                                        <CardItem>
                                                            <Thumbnail square large source={{ uri: `data:image/jpeg;base64,${carrito[item].Image}` }} />
                                                            <Left>
                                                                <TouchableOpacity style={{width:170}}>
                                                                    <Body>
                                                                        <Text style={styles.titulo}>{carrito[item].Producto}</Text>
                                                                        <Text>{carrito[item].Nombre}</Text>
                                                                        <Text>{Moment(carrito[item].FechaHoraEntrega).format('DD-MM-YYYY LT')}</Text>
                                                                        <Text>Cantidad: {Number.parseFloat(carrito[item].Cantidad)}</Text>
                                                                        <Text style={styles.um}>Valor: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(carrito[item].PrecioUnitario)}</Text>
                                                                    </Body>
                                                                </TouchableOpacity>
                                                                <TouchableOpacity style={{ marginLeft: 18 }} onPress={() => deleteItem(carrito[item].DetallePedidoId)}>
                                                                    <Icon name={'trash'} color="black" size={44} />
                                                                </TouchableOpacity>
                                                            </Left>

                                                        </CardItem>

                                                    </Card>

                                                ))}
                                                <Card>
                                                    <CardItem>

                                                        <Left>
                                                            <TouchableOpacity>
                                                                <Body>
                                                                    <Text>Costo envio: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(costoEnvio)}</Text>
                                                                    <Text>Subtotal IVA 0%: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(costoSinIva)}</Text>
                                                                    <Text>Subtotal IVA 12%: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(costoConIva)}</Text>
                                                                    <Text>IVA 12%: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(iva)}</Text>
                                                                    <Text>Total: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)}</Text>

                                                                </Body>
                                                            </TouchableOpacity>

                                                        </Left>

                                                    </CardItem>
                                                    <TouchableOpacity>
                                                        <Button onPress={() => navigation.navigate('Productos')}  title={'Seguir comprando'}></Button>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity>
                                                        <Button onPress={() => navigation.navigate('Pedido')} title={'Ir al Pedido'}></Button>
                                                    </TouchableOpacity>
                                                </Card>
                                            </ScrollView>
                                        
                                        :
                                        <>
                                        {activity ? (
                                            <View style={{ flex: 1, marginTop: 190 }}>
                                                <ActivityIndicator animating size={98} color="blue" />
                                            </View>
                                        ) : (
                                            <View style={{ flex: 1, marginTop: 140, alignItems:'center' }}>
                                                <Text>No hay items aún en tu carrito, busca tus productos y empieza a pedir</Text>
                                            </View>
                                            )}
                                       </>
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
        color: '#b71c1c',
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

export default Carrito;
