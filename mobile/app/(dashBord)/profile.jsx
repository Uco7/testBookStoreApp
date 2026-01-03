// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import ThemeView from '../../component/ThemeView'
// import ThemeText from '../../component/ThemeText'
// import { Link } from 'expo-router'
// import Spacer from '../../component/Spacer'

// const profile = () => {
//   return (
//     <ThemeView>
//       <ThemeText>Profile Page</ThemeText>
//       <Spacer/>
//       <Link href="/create"><ThemeText>Create Book</ThemeText></Link>
//       <Spacer/>  
//       <Link href="/book"><ThemeText>Book Shelve</ThemeText></Link>
//       <Spacer/>  
//       <Link href="/"><ThemeText>Back To Home</ThemeText></Link>
//     </ThemeView>
//   )
// }

// export default profile

// const styles = StyleSheet.create({})
import { StyleSheet, View } from "react-native";
import React from "react";
import ThemeView from "../../component/ThemeView";
import ThemeText from "../../component/ThemeText";
import { Link } from "expo-router";
import Spacer from "../../component/Spacer";
import { useUser } from "../../hook/useUser";

const Profile = () => {
  const { user, authToken } = useUser();

  if (!authToken) {
    return (
      <ThemeView>
        <ThemeText>Loading...</ThemeText>
      </ThemeView>
    );
  }

  if (!user) {
    return (
      <ThemeView>
        <ThemeText>No user logged in.</ThemeText>
        <Link href="/login">
          <ThemeText>Go to Login</ThemeText>
        </Link>
      </ThemeView>
    );
  }

  return (
    <ThemeView>
      <ThemeText>Profile Page</ThemeText>
      <Spacer />

      <ThemeText>Email: {user.email}</ThemeText>
      <ThemeText>User ID: {user._id}</ThemeText>
      {user.name && <ThemeText>Name: {user.name}</ThemeText>}

      <Spacer />
      <Link href="/create"><ThemeText>Create Book</ThemeText></Link>
      <Spacer />
      <Link href="/book"><ThemeText>Book Shelf</ThemeText></Link>
      <Spacer />
      <Link href="/"><ThemeText>Back To Home</ThemeText></Link>
    </ThemeView>
  );
};

export default Profile;

const styles = StyleSheet.create({});
