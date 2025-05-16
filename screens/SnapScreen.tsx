import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { CameraView, CameraType, FlashMode, Camera, CameraCapturedPicture } from "expo-camera";
import { useDispatch } from "react-redux";
import { addPhoto } from "../reducers/user";
import FontAwesome from "react-native-vector-icons/FontAwesome";
let _FontAwesome = FontAwesome as React.ElementType;
import { useIsFocused } from "@react-navigation/native";

export default function SnapScreen() {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  // Reference to the camera
  const cameraRef = useRef<CameraView | null>(null);

  // Permission hooks
  const [hasPermission, setHasPermission] = useState(false);
  const [facing, setFacing] = useState<CameraType>("back");
  const [flashStatus, setFlashStatus] = useState<FlashMode>("off");

  // Effect hook to check permission upon each mount
  useEffect(() => {
    (async () => {
      const result = await Camera.requestCameraPermissionsAsync();
      setHasPermission(result && result?.status === "granted");
    })();
  }, []);

  // Conditions to prevent more than 1 camera component to run in the bg
  if (!hasPermission || !isFocused) {
    return <View />;
  }

  // Functions to toggle camera facing and flash status
  const toggleCameraFacing = () => {
    setFacing((current: CameraType) => (current === "back" ? "front" : "back"));
  };

  const toggleFlashStatus = () => {
    setFlashStatus((current: FlashMode) => (current === "off" ? "on" : "off"));
  };

  // Function to take a picture and save it to the reducer store
  const takePicture = async () => {
    const photo: CameraCapturedPicture | undefined = await cameraRef.current?.takePictureAsync({
      quality: 0.3,
    });
		if (!photo?.uri) return
    if (photo) {
      const formData: any = new FormData();
      formData.append("photoFromFront", {
        uri: photo.uri,
        name: "photo.jpg",
        type: "image/jpeg",
      });
      fetch("https://faceup-backend-six-plum.vercel.app/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          data.result && dispatch(addPhoto(data.url));
        });
    }
  };

  return (
    <CameraView
      style={styles.camera}
      facing={facing}
      flash={flashStatus}
      ref={(ref: any) => (cameraRef.current = ref)}
    >
      {/* Top container with the setting buttons */}

      <SafeAreaView style={styles.settingContainer}>
        <TouchableOpacity
          style={styles.settingButton}
          onPress={toggleFlashStatus}
        >
          <_FontAwesome
            name="flash"
            size={25}
            color={flashStatus === "on" ? "#e8be4b" : "white"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingButton}
          onPress={toggleCameraFacing}
        >
          <_FontAwesome name="rotate-right" size={25} color="white" />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Bottom container with the snap button */}
      <View style={styles.snapContainer}>
        <TouchableOpacity style={styles.snapButton} onPress={takePicture}>
          <_FontAwesome name="circle-thin" size={95} color="white" />
        </TouchableOpacity>
      </View>
    </CameraView>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  settingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
  },
  settingButton: {
    width: 40,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  snapContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  snapButton: {
    width: 100,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
