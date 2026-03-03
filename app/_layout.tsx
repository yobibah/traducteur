import { Stack } from "expo-router";
import { Dimensions, Text, View } from "react-native";

import { Ionicons } from '@react-native-vector-icons/ionicons';
export default function RootLayout() {
  const widthL = (Dimensions.get('window').width )* 0.8; 
  return <Stack
    screenOptions={{
      headerStyle: { backgroundColor: '#e17100',  },

      headerTitle: () => (

        <View>
        <View style={{ display: 'flex', flexDirection: 'row' }}>


          <View style={{ display: 'flex', flexDirection: 'row' }} >
            <View style={{ backgroundColor: '#ff8904', justifyContent: 'center', borderRadius: 5 }}>
              <Text style={{ fontSize: 20, color: '#fff', fontWeight: 'bold', padding: 6 }}>T</Text>
            </View>

            <Text style={{ fontSize: 20, color: '#fff', fontWeight: 'bold', padding: 6 }}>Traducteur</Text>
          </View>
          <View style={{ backgroundColor: '#ff8904', justifyContent: 'center', borderRadius: 100, position: 'absolute', right: 0 }}>
            <Ionicons name='home' size={19} color={'#fff'} style={{ padding: 10 }} />
          </View>


        </View>


<View style={{backgroundColor:'#fff',borderRadius:9, padding:12, paddingBottom:12, width:widthL}}>
  <Text>h</Text>

</View>
        </View>
      ),
      headerTintColor: '#e17100',
      headerBackVisible: true
    }}
  />;
}
