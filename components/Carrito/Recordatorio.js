import React, {useState } from 'react';
import { Card, CardItem, Input, Label, Form, Item, Tab, Tabs, Left, Thumbnail, Image, Body, Right } from 'native-base';
import {
    SafeAreaView, ActivityIndicator,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    Dimensions, Button, ToastAndroid,
} from 'react-native';
import Moment, { locales } from 'moment';
import CheckBox from '@react-native-community/checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { RadioButton } from 'react-native-paper';
import '../../utils/Config';

const Recordatorio = (props) => {
    var [producto, setProducto] = useState(props.item);
    var [unaVez, setUnaVez] = useState(0);  
    var [unaVezText, setUnaVezText] = useState('');  
    var [comprasRecurrente, setComprasRecurrente] = useState(0);   
    var [comprasRecurrenteText, setComprasRecurrenteText] = useState('');   
    var [enDias, setEnDias] = useState(''); 
    var [enSemanas, setEnSemanas] = useState(''); 
    var [enMeses, setEnMeses] = useState(''); 
    var [enEnLaFecha, setEnLaFecha] = useState(''); 
    var [showEnLaFecha, setShowEnLaFecha] = useState(false); 
    var [cadaDias, setCadaDias] = useState(''); 
    var [cadaSemana, setCadaSemana] = useState(''); 
    var [cadaMeses, setCadaMeses] = useState(''); 
    var [temporadas, setTemporadas] = useState([]);
    var [temporada, setTemporada] = useState('');
    var [temporadaNavidena, setTemporadaNavidena] = useState(false);
    var [diaPadre, setDiaPadre] = useState(false);
    var [diaMadre, setDiaMadre] = useState(false);
    var [diaNino, setDiaNino] = useState(false);
    var [sanValentin, setSanValentin] = useState(false);
    var [descripcion, setDescripcion] = useState('');

    const toast = (message, duration) => {
        ToastAndroid.show(message, ToastAndroid.BOTTOM)
    }
    const changeEnLaFecha = async (datetime) => {
        if (datetime) {
            setShowEnLaFecha(false);
            setEnLaFecha(Moment(datetime).format('YYYY-MM-DD'));
        } else {
            setShowEnLaFecha(false);
        }
      }

    const prepararUnaVez = () => {
        switch(unaVez){
            case 1:
                setUnaVezText('En la siguiente compra');
                break;
            case 2:
                setUnaVezText(`En ${enDias} dias`);
                break;  
            case 3:
                setUnaVezText(`En ${enSemanas} semanas`);
                break;
            case 4:
                setUnaVezText(`En ${enMeses} meses`);
                break;
            case 5:
                setUnaVezText(`En la fecha`);
                break;
            case 6:
                setUnaVezText(`En listado de pendientes`);
                break;  
            case 7:
                setUnaVezText(`En listado de deseados`);
                break;       
        }
    }
    const prepararComprasRecurrentes = () => {
        switch(comprasRecurrente){
            case 1:
                setComprasRecurrenteText(`Cada ${cadaDias} dias`);
                break;
            case 2:
                setComprasRecurrenteText(`En ${enSemanas} semanas`);
                break;  
            case 3:
                setComprasRecurrenteText(`En ${enMeses} meses`);
                break;
        }
    }

    const preprarTemporadas = (nro, event) => {
        switch (nro) {
            case 1:
                setTemporadaNavidena(event); setTemporada('Temporada navideña');
                setTemporadas(temporadas => [...temporadas, {'Temporada': 'Temporada navideña'}]);
                break;
            case 2:
                setDiaPadre(event); setTemporada('Día de la Madre');
                setTemporadas(temporadas => [...temporadas, {'Temporada': 'Día de la Madre'}]);
                break;
            case 3:
                setDiaMadre(event); setTemporada('Día del Padre');
                setTemporadas(temporadas => [...temporadas, {'Temporada': 'Día del Padre'}]);
                break;
            case 4:
                setDiaNino(event); setTemporada('Día del niño');
                setTemporadas(temporadas => [...temporadas, {'Temporada': 'Día del niño'}]);
                break;
            case 5:
                setSanValentin(event); setTemporada('San Valentín');
                setTemporadas(temporadas => [...temporadas, {'Temporada': 'San Valentín'}]);
                break;
        }
    }

    const addEstablecer = () => {
        prepararUnaVez();
        prepararComprasRecurrentes();
        addRecordatorio();
    }

    const addRecordatorio = async () => {
        await fetch(`${global.config.appConfig.url.dev}POC_Recordatorio`, {
            method: 'POST',
            headers: global.config.appConfig.headers.dev,
            body: JSON.stringify({
                'ClienteId': producto.ClienteId,
                'ProductoId': producto.ProductoId,
                'OfertaId': producto.OfertaId,
                'UnaVez': unaVezText,
                'Recurrente': comprasRecurrenteText,
                'Temporadas': temporadas,
                'Temporada': 'Ejemplo',
                'Descripcion': descripcion
            }),
            json: true
        }).then(response => {
            if (response.status >= 200 && response.status <= 299) {
                return response.json()
            }
            else { // si no se obtiene una respuesta
                response.json().then((json) => {
                    const { Message, StrackTraceString } = json;
                });
                return null
            }
        }).catch(e => { console.log(e); });
        setTimeout(() => {
            props.open(false);
        }, 1000);
    }

    return (
        <SafeAreaView>
            <ScrollView>
                {(producto !== '') ?
                    <ScrollView style={{ marginTop: 0 }}>
                        <TouchableOpacity onPress={() => props.open(false)}>
                            <Card style={{ alignItems: 'center', marginTop: 0 }}>
                                <CardItem style={{ paddingBottom: -5, paddingTop: -5 }}>
                                    <Icon name={'chevron-left'} color="black" size={34} />
                                </CardItem>
                            </Card>
                        </TouchableOpacity>
                        <Text style={styles.titulo}>Recordar Compra</Text>
                        <Card style={{ flex: 1 }}>
                            <CardItem>
                                <Thumbnail square large source={{ uri: `data:image/jpeg;base64,${producto.Image}` }} />
                                <Left>
                                    <TouchableOpacity>
                                        <Body>
                                            <Text style={styles.azul}>{producto.Nombre}</Text>
                                            <Text style={styles.local}>{producto.Local}</Text>
                                        </Body>
                                    </TouchableOpacity>

                                </Left>
                            </CardItem>
                        </Card>
                        <View>
                            <View style={{flex: 1}}>
                            <Label style={styles.titulo}>Una vez</Label>
                                <Item style={{ margin: 5, flexDirection:'row' }}>
                                    <View style={{flexDirection:'row',}}>
                                        <Label>En la sig. compra:</Label>
                                        <RadioButton color="#3F51B5"
                                            value={1}
                                            status={unaVez === 1 ? 'checked' : 'unchecked'}
                                            onPress={() => setUnaVez(1)}
                                        />
                                    </View>
                                    </Item>
                                    <Item>
                                    <View style={{flexDirection:'row', }}>
                                        <Label>En dias</Label>
                                        <RadioButton color="#3F51B5"
                                            value={2}
                                            status={unaVez === 2 ? 'checked' : 'unchecked'}
                                            onPress={() => setUnaVez(2)}
                                        />
                                        <Input underlineColorAndroid="blue" placeholderTextColor="#666666" name="enDias" value={enDias} onChangeText={text => setEnDias(text)} />
                                    </View>
                                    </Item>
                                    <Item>
                                        <Label>En semanas</Label>
                                        <RadioButton color="#3F51B5"
                                            value={3}
                                            status={unaVez === 3 ? 'checked' : 'unchecked'}
                                            onPress={() => setUnaVez(3)}
                                        />
                                        <Input underlineColorAndroid="blue" placeholderTextColor="#666666" name="enSemanas" value={enSemanas} onChangeText={text => setEnSemanas(text)} />
                                    </Item>
                                    <Item>
                                        <Label>En meses</Label>
                                        <RadioButton color="#3F51B5"
                                            value={4}
                                            status={unaVez === 4 ? 'checked' : 'unchecked'}
                                            onPress={() => setUnaVez(4)}
                                        />
                                        <Input underlineColorAndroid="blue" placeholderTextColor="#666666" name="enMeses" value={enMeses} onChangeText={text => setEnMeses(text)} />
                                </Item>
                                <Item>
                                    <Label>En la fecha: </Label>
                                    <RadioButton color="#3F51B5"
                                        value={4}
                                        status={unaVez === 5 ? 'checked' : 'unchecked'}
                                        onPress={() => setUnaVez(5)}
                                    />
                                    <TouchableOpacity onPress={() => setShowEnLaFecha(true)}>
                                        <Label>{enEnLaFecha !== '' ? Moment(enEnLaFecha).format('YYYY-MM-DD') : "Coloca fecha"}</Label>
                                    </TouchableOpacity>
                                    {showEnLaFecha ? (
                                        <DateTimePicker
                                        value={new Date()}
                                        is24Hour={false}
                                        mode="date"
                                        format="YYYY-MM-DD"
                                        display="default"
                                        onChange={changeEnLaFecha}
                                        >
                                        </DateTimePicker>
                                    ) : (
                                        <></>
                                        )}
                                </Item>
                                <Item>
                                    <Label>En listado de pendientes</Label>
                                        <RadioButton color="#3F51B5"
                                            value={6}
                                            status={unaVez === 6 ? 'checked' : 'unchecked'}
                                            onPress={() => setUnaVez(6)}
                                        />
                                        
                                </Item>
                                <Item>
                                    <Label>En listado de deseados</Label>
                                        <RadioButton color="#3F51B5"
                                            value={7}
                                            status={unaVez === 7 ? 'checked' : 'unchecked'}
                                            onPress={() => setUnaVez(7)}
                                        />
                                        
                                </Item>
                            </View>
                            <View style={{flex: 1}}>
                            <Label style={styles.titulo}>Compras recurrentes</Label>
                                <Item>
                                    <Label>Cada dias</Label>
                                        <RadioButton color="#3F51B5"
                                            value={1}
                                            status={comprasRecurrente === 1 ? 'checked' : 'unchecked'}
                                            onPress={() => setComprasRecurrente(1)}
                                        />
                                        <Input underlineColorAndroid="blue" placeholderTextColor="#666666" name="cadaDias" value={cadaDias} onChangeText={text => setCadaDias(text)} />
                                </Item>
                                <Item>
                                    <Label>Cada semanas</Label>
                                        <RadioButton color="#3F51B5"
                                            value={2}
                                            status={comprasRecurrente === 2 ? 'checked' : 'unchecked'}
                                            onPress={() => setComprasRecurrente(2)}
                                        />
                                        <Input underlineColorAndroid="blue" placeholderTextColor="#666666" name="cadaSemana" value={cadaSemana} onChangeText={text => setCadaSemana(text)} />
                                </Item>
                                <Item>
                                    <Label>Cada meses</Label>
                                        <RadioButton color="#3F51B5"
                                            value={3}
                                            status={comprasRecurrente === 3 ? 'checked' : 'unchecked'}
                                            onPress={() => setComprasRecurrente(3)}
                                        />
                                        <Input underlineColorAndroid="blue" placeholderTextColor="#666666" name="cadaMeses" value={cadaMeses} onChangeText={text => setCadaMeses(text)} />
                                </Item>
                            </View>
                            <View style={{flex: 1}}>
                            <Label style={styles.titulo}>Compras de temporada</Label>
                                <Item>
                                    <Label>Temporada navideña</Label>
                                        <CheckBox
                                            style={{ borderColor: "blue" }}
                                            value={temporadaNavidena}
                                            onValueChange={(event) => preprarTemporadas(1, event)} />
                                </Item>
                                <Item>
                                    <Label>Día del padre</Label>
                                    <CheckBox
                                            style={{ borderColor: "blue" }}
                                            value={diaPadre}
                                            onValueChange={(event) => preprarTemporadas(2, event)} />
                                </Item>
                                <Item>
                                    <Label>Día de la madre</Label>
                                    <CheckBox
                                            style={{ borderColor: "blue" }}
                                            value={diaMadre}
                                            onValueChange={(event) => preprarTemporadas(3, event)} />
                                </Item>
                                <Item>
                                    <Label>Día del niño</Label>
                                    <CheckBox
                                            style={{ borderColor: "blue" }}
                                            value={diaNino}
                                            onValueChange={(event) => preprarTemporadas(4, event)} />
                                </Item>
                                <Item>
                                    <Label>San Valentín</Label>
                                    <CheckBox
                                            style={{ borderColor: "blue" }}
                                            value={sanValentin}
                                            onValueChange={(event) => preprarTemporadas(5, event)} />
                                </Item>
                            </View>

                            <View style={{flex: 1}}>
                                <Label>Notas para mi cuando me avisen</Label>
                                <Input placeholderTextColor="#666666" name="descripcion" value={descripcion} onChangeText={text => setDescripcion(text)} />
                            </View>
                            
                            <View style={{flex: 1, flexDirection:'row'}}>
                                <TouchableOpacity style={{width:100, margin: 10}}>
                                    <Button color="#3F51B5" title={'Guardar'} onPress={() => addEstablecer()}></Button>
                                </TouchableOpacity>
                                
                            </View>  

                        </View>
                    </ScrollView>
                    :
                    <View style={{ flex: 1, marginTop: 140 }}>
                        <ActivityIndicator size={88} color="blue" />
                    </View>
                }
            </ScrollView>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        padding: 14,
    },
    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    azul: {
        fontSize: 18,
        fontWeight: 'bold',
        color:'blue',
    },
    local: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});
export default Recordatorio;
