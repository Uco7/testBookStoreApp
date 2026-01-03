import { AuthProvider,AuthContext } from "./src/context/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { useContext } from "react";

function Root(){
  const {token} = useContext(AuthContext);
  return <AppNavigator token={token}/>;
}

export default function App(){
  return (
    <AuthProvider>
      <Root/>
    </AuthProvider>
  );
}
