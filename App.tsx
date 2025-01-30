import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {
  requestUserPermission,
  notificationListner,
} from './src/utils/notificationService';

const App = () => {
  useEffect(() => {
    requestUserPermission();
    notificationListner();
  }, []);

  return (
    <View>
      <Text>
        hello
      </Text>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({});