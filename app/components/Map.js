import React from "react";
import MapView from "react-native-maps";
import openMap, { createOpenLink } from "react-native-open-map";
import { Platform } from "react-native";

export default function Map(props) {
  const { location, name, height } = props;

  const openAppMap = () => {
    //console.log(Platform.OS);
    //Platform.OS === "android"
    /*? openMap(location.latitude, location.longitude)
      : */ openMap.show({
      latitude: location.latitude,
      longitude: location.longitude,
      //zoom: 19,
      title: name,
    });
  };

  return (
    <MapView
      style={{ height: height, width: "100%" }}
      initialRegion={location}
      onPress={openAppMap}
    >
      <MapView.Marker
        coordinate={{
          latitude: location.latitude,
          longitude: location.longitude,
        }}
      />
    </MapView>
  );
}
