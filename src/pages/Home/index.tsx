import React, { useState, useEffect, ChangeEvent } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, Image, StyleSheet, Text, ImageBackground } from 'react-native'; 
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUFResponse {
  sigla: string
}

interface IBGECityResponse {
  nome: string
}

const Home = () => {
  
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity,setSelectedCity] = useState('');
  const [selectedUf,setselectedUf] = useState('0');
  const navigation = useNavigation();

  function handleNavToPoints () {
    navigation.navigate('Points', {
      uf: selectedUf,
      city: selectedCity
    });
  }
  useEffect(()=>{
    async function setuf() {
      await axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
        const ufInitials = response.data.map( uf  => uf.sigla);

        setUfs(ufInitials);
    });
    }
    setuf();
}, []);


useEffect(() => {

  async function setcities() {
    await axios
    .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
    .then( response => {
        const citiesNames = response.data.map( city  => city.nome);

        setCities(citiesNames);

    });

  }
    if (selectedUf === '0') return;
    setcities();
  }, [selectedUf]);

function handleSelectUF(value: string) {
  const uf = value;
  setselectedUf(uf);
}

function handleSelectCity(value: string) {
  const city = value;
  setSelectedCity(city);
}
  return (
  <ImageBackground 
  source={require('../../assets/home-background.png')} 
  style={styles.container}
  imageStyle={{ width: 274, height: 368}}
  >
    <View style={styles.main}>
      <Image source={require('../../assets/logo.png')} />
      <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
      <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coletas de forma eficiente.</Text>
    </View>
    <View style={styles.footer}>
      <RNPickerSelect
       style={pickerSelectStyles}
      placeholder={{label: 'Escolha um Estado'}}
      onValueChange={(value) => handleSelectUF(value)}
      items={ufs.sort((a, b) => {
        return a < b ? -1 : a > b ? 1 : 0;
      }).map(uf => {
        return {key:uf, label: uf, value: uf }
      })}
      />
      {selectedUf !== '0' && (
      <RNPickerSelect
      style={pickerSelectStyles}
      placeholder={{label: 'Escolha uma Cidade'}}
      onValueChange={(value) => handleSelectCity(value)}
      items={cities.sort((a, b) => {
        return a < b ? -1 : a > b ? 1 : 0;
      }).map(city => {
        return {key: city, label: city, value: city }
      })}
      />)}
      <RectButton 
      style={styles.button} 
      onPress={handleNavToPoints}
      >
        <View style={styles.buttonIcon}>
          <Text>
            <Icon 
            name="arrow-right" 
            color="#FFF" 
            size={24}></Icon>
          </Text>
        </View>
        <Text style={styles.buttonText}>Entrar</Text>
      </RectButton>
    </View>
  </ImageBackground>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: '#f0f0f5',
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
    
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 30,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: '#000',
    borderRadius: 8,
    color: '#000',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});