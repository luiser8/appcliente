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
    Dimensions,
} from 'react-native';
import Moment, { locales } from 'moment';
import { Label, Item } from 'native-base';
import CheckBox from '@react-native-community/checkbox';

const Adicional = (props) => {
    var deviceWidth = Dimensions.get('window').width;
    var deviceHeight = Dimensions.get('window').height;
    var [lunes, setLunes] = useState(false);
    var [martes, setMartes] = useState(false);
    var [miercoles, setMiercoles] = useState(false);
    var [jueves, setJueves] = useState(false);
    var [viernes, setViernes] = useState(false);
    var [sabado, setSabado] = useState(false);
    var [domingo, setDomingo] = useState(false);
    var [fechasEntrega, setFechasEntrega] = useState([]);

    const changeLunes = (event) => {
        setLunes(event); //props.fecha(Moment().format('DD-MM-YYYY'));
        setFechasEntrega(fecha => [...fecha, {'Fecha': Moment().format('DD-MM-YYYY')}]);
    }
    const changeMartes = (event) => {
        setMartes(event);//props.fecha(Moment().subtract(-1, 'days').format('DD-MM-YYYY'));
        setFechasEntrega(fecha => [...fecha, {'Fecha': Moment().subtract(-1, 'days').format('DD-MM-YYYY')}]);
    }
    const changeMiercoles = (event) => {
        setMiercoles(event); //props.fecha(Moment().subtract(-2, 'days').format('DD-MM-YYYY'));
        setFechasEntrega(fecha => [...fecha, {'Fecha': Moment().subtract(-2, 'days').format('DD-MM-YYYY')}]);
    }
    const changeJueves = (event) => {
        setJueves(event); //props.fecha(Moment().subtract(-3, 'days').format('DD-MM-YYYY'));
        setFechasEntrega(fecha => [...fecha, {'Fecha': Moment().subtract(-3, 'days').format('DD-MM-YYYY')}]);
    }
    const changeViernes = (event) => {
        setViernes(event); //props.fecha(Moment().subtract(-4, 'days').format('DD-MM-YYYY'));
        setFechasEntrega(fecha => [...fecha, {'Fecha': Moment().subtract(-4, 'days').format('DD-MM-YYYY')}]);
    }
    const changeSabado = (event) => {
        setSabado(event); //props.fecha(Moment().subtract(-5, 'days').format('DD-MM-YYYY'));
        setFechasEntrega(fecha => [...fecha, {'Fecha': Moment().subtract(-5, 'days').format('DD-MM-YYYY')}]);
    }
    const changeDomingo = (event) => {
        setDomingo(event); //props.fecha(Moment().subtract(-6, 'days').format('DD-MM-YYYY'));
        setFechasEntrega(fecha => [...fecha, {'Fecha': Moment().subtract(-6, 'days').format('DD-MM-YYYY')}]);
    }

    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>
                <Text style={styles.textWrapper}>Fecha de Entrega</Text>
                <View style={{ marginLeft: 30 }}>
                    <Item>
                        <CheckBox
                            style={{ borderColor: "blue" }}
                            value={lunes}
                            onValueChange={(event) => changeLunes(event)} />
                        <Label style={styles.label}>{Moment().format('dddd')} {Moment().format('DD-MM-YYYY')}</Label>
                    </Item>
                    <Item>
                        <CheckBox
                            style={{ borderColor: "blue" }}
                            value={martes}
                            onValueChange={(event) => changeMartes(event)} />
                        <Label style={styles.label}>{Moment().subtract(-1, 'days').format('dddd')} {Moment().subtract(-1, 'days').format('DD-MM-YYYY')}</Label>
                    </Item>
                    <Item>
                        <CheckBox
                            style={{ borderColor: "blue" }}
                            value={miercoles}
                            onValueChange={(event) => changeMiercoles(event)} />
                        <Label style={styles.label}>{Moment().subtract(-2, 'days').format('dddd')} {Moment().subtract(-2, 'days').format('DD-MM-YYYY')}</Label>
                    </Item>
                    <Item>
                        <CheckBox
                            style={{ borderColor: "blue" }}
                            value={jueves}
                            onValueChange={(event) => changeJueves(event)} />
                        <Label style={styles.label}>{Moment().subtract(-3, 'days').format('dddd')} {Moment().subtract(-3, 'days').format('DD-MM-YYYY')}</Label>
                    </Item>
                    <Item>
                        <CheckBox
                            style={{ borderColor: "blue" }}
                            value={viernes}
                            onValueChange={(event) => changeViernes(event)} />
                        <Label style={styles.label}>{Moment().subtract(-4, 'days').format('dddd')} {Moment().subtract(-4, 'days').format('DD-MM-YYYY')}</Label>
                    </Item>
                    <Item>
                        <CheckBox
                            style={{ borderColor: "blue" }}
                            value={sabado}
                            onValueChange={(event) => changeSabado(event)} />
                        <Label style={styles.label}>{Moment().subtract(-5, 'days').format('dddd')} {Moment().subtract(-5, 'days').format('DD-MM-YYYY')}</Label>
                    </Item>
                    <Item>
                        <CheckBox
                            style={{ borderColor: "blue" }}
                            value={domingo}
                            onValueChange={(event) => changeDomingo(event)} />
                        <Label style={styles.label}>{Moment().subtract(-6, 'days').format('dddd')} {Moment().subtract(-6, 'days').format('DD-MM-YYYY')}</Label>
                    </Item>
                </View>
                
                    <Text style={styles.textWrapper}>Promoción</Text>
                
                <View style={{ marginLeft: 30 }}>
                    <Item>
                        <CheckBox
                            style={{ borderColor: "blue" }}
                            value={false}
                            onValueChange={(event) => alert(event)} />
                        <Label>Con descuento</Label>
                    </Item>
                    <Item>
                        <CheckBox
                            style={{ borderColor: "blue" }}
                            value={false}
                            onValueChange={(event) => alert(event)} />
                        <Label>En combo</Label>
                    </Item>
                    <Item>
                        <CheckBox
                            style={{ borderColor: "blue" }}
                            value={false}
                            onValueChange={(event) => alert(event)} />
                        <Label>Con promoción</Label>
                    </Item>
                </View>
        
            <View style={{ flex: 1 }}>
                <View style={{ alignItems:'flex-start'}}>
                    <TouchableOpacity style={styles.appButtonContainer} onPress={() => props.open(3, true)}>
                        <Text style={styles.appButtonText}>{'Cerrar'}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ alignItems:'flex-end',}}>
                    <TouchableOpacity style={styles.appButtonContainer2} onPress={() => props.fecha(7, true, fechasEntrega)}>
                        <Text style={styles.appButtonText}>{'Aplicar'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            </ScrollView>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    appButtonContainer: {
        marginTop: 4,
        paddingTop: 6,
        paddingBottom: 12,
        elevation: 2,
        backgroundColor: "#fff",
        borderRadius: 18,
        paddingVertical: 10,
        paddingHorizontal: 36
    },
    appButtonContainer2: {
        marginTop: -36,
        paddingTop: 2,
        paddingBottom: 12,
        elevation: 2,
        backgroundColor: "#fff",
        borderRadius: 18,
        paddingVertical: 12,
        paddingHorizontal: 36
    },
    appButtonText: {
        fontSize: 16,
        color: "#000",
        alignSelf: "center",
    },
    container: {
        padding: 10,
    },
    label: {
        textTransform:'capitalize',
    },
    buttons: {
        padding: 10,
        fontSize: 18,
    },
    textWrapper: {
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});
export default Adicional;
