import { createContext, useReducer, useContext, useMemo } from 'react'

const AuthContext = createContext()

function authReducer(state, action) {
  switch (action.type) {
    case 'setAddress': {
      return {...state, address: action.address }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function AuthProvider({children}) {
  const [state, dispatch] = useReducer(authReducer, { address: '' })
  const value = useMemo(() => ({state, dispatch}), [state])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
      throw new Error('useAuth must be used within a AuthProvider')
    }
    return context
  }

export { AuthProvider, useAuth }