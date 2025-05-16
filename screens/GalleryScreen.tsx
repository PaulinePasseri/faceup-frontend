import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  StatusBar
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { removePhoto, UserState } from '../reducers/user';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
let _FontAwesome = FontAwesome as React.ElementType;

export default function GalleryScreen() {
  const dispatch = useDispatch();
  const user = useSelector((state: { user: UserState }) => state.user.value);

  const photos = user.photos.map((data: string, i: number) => {
    return (
      <View key={i} style={styles.photoContainer}>
        <TouchableOpacity onPress={() => dispatch(removePhoto(data))}>
          <_FontAwesome name='times' size={20} color='#000000' style={styles.deleteIcon} />
        </TouchableOpacity>

        <Image source={{ uri: data }} style={styles.photo} />
      </View>
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Gallery</Text>
      <Text style={styles.text}>Logged as: {user.email}</Text>

      <ScrollView contentContainerStyle={styles.galleryContainer}>
        {photos}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  galleryContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  photoContainer: {
    alignItems: 'flex-end',
  },
  photo: {
    margin: 10,
    width: 150,
    height: 150,
  },
  title: {
    fontFamily: 'Futura',
    fontSize: 22,
    marginTop: 10,
    marginBottom: 10,
  },
  deleteIcon: {
    marginRight: 10,
  },
  text: {
    marginBottom: 15,
  },
});
