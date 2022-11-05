import { createContext, ReactNode, useEffect, useState } from "react";
import { makeRedirectUri } from 'expo-auth-session'
import { maybeCompleteAuthSession } from "expo-web-browser";
import { useAuthRequest } from "expo-auth-session/build/providers/Google";
import { api } from "../services/api";

maybeCompleteAuthSession()

interface AuthProviderProps {
  children: ReactNode
}

interface IUser {
  name: string
  avatarUrl: string
}

export interface IAuthContext {
  user: IUser
  isUserLoading: boolean
  signIn: () => Promise<void>
}

export const AuthContext = createContext({} as IAuthContext)

export function AuthContextProvider({ children }: AuthProviderProps) {
  const [isUserLoading, setUserLoading] = useState<boolean>(false)
  const [user, setUser] = useState<IUser>({} as IUser)

  const [request, response, promptAsync] = useAuthRequest({
    clientId: process.env.GOOGLE_CLIENT_ID,
    redirectUri: makeRedirectUri({ useProxy: true }),
    scopes: ['profile', 'email']
  })

  async function signIn() {
    try {
      setUserLoading(true)
      await promptAsync()
    } catch(err) {
      console.log(err)
      throw err
    } finally {
      setUserLoading(false)
    }
  }

  async function signInWithGoogle(accessToken: string) {
    try {
      setUserLoading(true)
      console.log('a')
      const response = await api.post('/auth', { accessToken })
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
      console.log('a')
      const userResponse = await api.get('/me');
      console.log('a')
      setUser(userResponse.data.user)
    } catch(err) {
      console.log(err)
      throw err
    } finally {
      setUserLoading(false)
    }
  }

  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      signInWithGoogle(response.authentication.accessToken)
    }
  }, [response])

  return (
    <AuthContext.Provider value={{
      signIn,
      isUserLoading,
      user
    }}>
      { children }
    </AuthContext.Provider>
  )
}