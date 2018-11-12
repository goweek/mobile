import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  FlatList
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import socket from "socket.io-client";

import api from "../services/api";

// components
import Tweet from "../components/Tweet";

export default class Timeline extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Início",
    headerRight: (
      <TouchableOpacity onPress={() => navigation.navigate("New")}>
        <Ionicons
          name={
            Platform.OS === "ios"
              ? "ios-add-circle-outline"
              : "md-add-circle-outline"
          }
          style={{ marginRight: 20 }}
          size={24}
          color="#4BB0EE"
        />
      </TouchableOpacity>
    )
  });

  state = {
    tweets: []
  };

  async componentDidMount() {
    this.subscribeToEvents();

    const response = await api.get("/tweets");

    this.setState({ tweets: response.data });
  }

  subscribeToEvents = () => {
    const io = socket("http://192.168.0.15:3000");

    io.on("tweet", data => {
      this.setState({
        tweets: [data, ...this.state.tweets]
      });
    });

    io.on("like", data => {
      this.setState({
        tweets: this.state.tweets.map(tweet =>
          tweet._id === data._id ? data : tweet
        )
      });
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.tweets}
          keyExtractor={tweet => tweet._id}
          renderItem={({ item }) => <Tweet tweet={item} />}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  }
});
