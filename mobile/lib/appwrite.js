import { Client, Account, ID, Models } from 'react-native-appwrite';



const client = new Client();
client
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('6941b66c0004e4c04ffb')   // Your Project ID
  .setPlatform('reactNative.createContext.lession2');   // Your package name / bundle identifier

export const account = new Account(client);

<View style={[styles.iconRow, styles.field]}>
  <Pressable
    onPress={() => openFile(item.fileUrl)}
    style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
  >
    <MaterialIcons name="menu-book" size={28} color="#444" />
    <ThemeText style={styles.iconTitle}>Open</ThemeText>
  </Pressable>

  <Pressable
    onPress={() => console.log("Update pressed")}
    style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
  >
    <MaterialIcons name="update" size={28} color="#444" />
    <ThemeText style={styles.iconTitle}>Update</ThemeText>
  </Pressable>

  <Pressable
    onPress={() => console.log("Delete pressed")}
    style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
  >
    <MaterialIcons name="delete" size={28} color="#444" />
    <ThemeText style={styles.iconTitle}>Delete</ThemeText>
  </Pressable>
</View>

