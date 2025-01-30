import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import {useNavigation} from '@react-navigation/native';
// import {createNavigationContainerRef} from '@react-navigation/native';

// export const navigationRef = createNavigationContainerRef();

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    console.log('Authorization status:', authStatus);
  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFcmToken();
  }
}

const getFcmToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  console.log('old token', fcmToken);
  if (!fcmToken) {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log('new generated token', fcmToken);
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    } catch (error) {
      console.log(error);
    }
  }
};

export const notificationListner = async () => {
  // Assume a message-notification contains a "type" property in the data payload of the screen to open

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );

    // if (remoteMessage.notification.title === 'hii') {
    //   navigationRef.navigate('LoginScreen', {screen: 'LoginScreen'});
    // }
  });

  PushNotification.configure({
    onNotification: function (notification) {
      console.log(
        'notification?.userInteraction',
        notification?.userInteraction,
      );

      if (notification?.userInteraction) {
        // if (navigationRef.isReady()) {
        // navigationRef.navigate('CartTab', {screen: 'CartTab'});
      }
    },
  });

  messaging().onMessage(async remoteMessage => {
    console.log('received in foreground ', remoteMessage);
    const {notification, messageId} = remoteMessage;
    PushNotification.localNotification({
      channelId: 'channel',
      // data: {screenName: 'Details'},
      id: messageId,
      body: notification.body,
      title: notification.title,
      soundName: 'default',
      vibrate: true,
      playSound: true,
      // priority: 'high',
      // visibility: 'public',
      // importance: 4,
    });
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });
};
