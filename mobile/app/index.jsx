import { StyleSheet, Text } from 'react-native';
import React from 'react';
import ThemeView from '../component/ThemeView';
import ThemeText from '../component/ThemeText';
import Spacer from "../component/Spacer";
import { Link } from 'expo-router';
import Logo from "../assets/logo.jpeg"
import { Image } from 'react-native';


const HomeScreen = () => {
  return (
    <ThemeView>
      <Image source={Logo} style={{width:"40%",height:"20%"}}/>
      <Spacer/>
      <ThemeText>
       Book Store App
      </ThemeText>

      <Spacer height={40} />

      <ThemeText>
        <Link href="/register">Register</Link>
      </ThemeText>

      <Spacer />

      <ThemeText>
        <Link href="/login">Login</Link>
      </ThemeText>

      <Spacer />

      <ThemeText>
        <Link href="/profile">Profile Page</Link>
      </ThemeText>
    </ThemeView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
