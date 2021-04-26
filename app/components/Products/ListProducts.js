import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Image } from "react-native-elements";
import { size } from "lodash";
import { useNavigation } from "@react-navigation/native";

export default function ListProducts(props) {
  const { products, handleLoadMore, isLoading } = props;
  const navigation = useNavigation();

  return (
    <View>
      {size(products) > 0 ? (
        <FlatList
          data={products}
          renderItem={(product) => (
            <Product product={product} navigation={navigation} />
          )}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0.5}
          onEndReached={handleLoadMore}
          ListFooterComponent={<FooterList isLoading={isLoading} />}
        />
      ) : (
        <View style={styles.loaderProducts}>
          <ActivityIndicator size="large" />
          <Text>Cargando Productos</Text>
        </View>
      )}
    </View>
  );
}

function Product(props) {
  const { product, navigation } = props;
  const { id, images, name, description } = product.item;
  const imageProduct = images[0];

  const goProduct = () => {
    navigation.navigate("product", {
      id,
      name,
    });
  };

  return (
    <TouchableOpacity onPress={goProduct}>
      <View style={styles.viewProduct}>
        <View style={styles.viewProductImage}>
          <Image
            resizeMode="cover"
            PlaceholderContent={<ActivityIndicator color="#fff" />}
            source={
              imageProduct
                ? { uri: imageProduct }
                : require("../../../assets/img/no-image.png")
            }
            style={styles.imageProduct}
          />
        </View>
        <View>
          <Text style={styles.productName}>{name}</Text>
          <Text style={styles.productDescription}>
            {description.substr(0, 60)}...
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function FooterList(props) {
  const { isLoading } = props;

  if (isLoading) {
    return (
      <View style={styles.loaderProducts}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else {
    return (
      <View style={styles.notFoundProducts}>
        <Text>No quedan más productos por cargar</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loaderProducts: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  viewProduct: {
    flexDirection: "row",
    margin: 10,
  },
  viewProductImage: {
    marginRight: 15,
  },
  imageProduct: {
    width: 80,
    height: 80,
  },
  productName: {
    fontWeight: "bold",
  },
  productDescription: {
    paddingTop: 2,
    color: "grey",
    width: 300,
  },
  notFoundProducts: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center",
  },
});
