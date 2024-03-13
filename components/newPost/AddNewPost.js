import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import React, { useContext } from "react";
import FormikPostUploader from "./FormikPostUploader";
import { UserContext } from "../../contexts/UserContext";
import FeatherIcons from "react-native-vector-icons/Feather";

const backIcon = <FeatherIcons name="arrow-left" size={30} color="white" />;

const AddNewPost = ({ navigation }) => {
  return (
    <View>
      <Header navigation={navigation} />
    </View>
  );
};

const Header = ({ navigation }) => {
  const { user } = useContext(UserContext);
  return (
    <SafeAreaView>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("HomeScreen")}>
          {backIcon}
        </TouchableOpacity>
        <Text style={{ color: "white", fontSize: 25, marginLeft: 60 }}>
          NEW POST
        </Text>
      </View>
      <FormikPostUploader navigation={navigation} user={user} />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 30,
    margin: 5,
    backgroundColor: "grey",
    borderRadius: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
    marginLeft: 20,
  },
});

export default AddNewPost;
