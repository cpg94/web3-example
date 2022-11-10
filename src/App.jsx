import { useEffect, useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { Upload } from "./components/Upload";
import { useAuth } from "./context/Auth";

function App() {

  const [isLoading, setIsLoading] = useState(true)

  const {
    state: { address },
    dispatch
  } = useAuth();

  useEffect(() => {
    const login = async () => {
      if(!window.ethereum) return

      const accounts = await window.ethereum.request({ method: 'eth_accounts' })

      if(accounts?.length){
        dispatch({
          type: 'setAddress',
          address: accounts[0]
        })
      }

      setIsLoading(false)
    }

    login()
  })

  return isLoading ? null : <div className="App">{address ? <Upload /> : <LoginPage />}</div>;
}

export default App;
