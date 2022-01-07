import {createContext, Dispatch, useContext} from "react"

type StateType = {
  provider?: any
  web3Provider?: any
  account?: string
  chainId?: number
}

export const initialWeb3State: StateType = {
  provider: null,
  web3Provider: null,
  account: null,
  chainId: null,
}

type ActionType =
  | {
  type: 'SET_WEB3_PROVIDER'
  provider?: StateType['provider']
  web3Provider?: StateType['web3Provider']
  account?: StateType['account']
  chainId?: StateType['chainId']
}
  | {
  type: 'SET_ACCOUNT'
  account?: StateType['account']
}
  | {
  type: 'SET_CHAIN_ID'
  chainId?: StateType['chainId']
}
  | {
  type: 'RESET_WEB3_PROVIDER'
}

export function web3Reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case 'SET_WEB3_PROVIDER':
      return {
        ...state,
        provider: action.provider,
        web3Provider: action.web3Provider,
        account: action.account,
        chainId: action.chainId,
      }
    case 'SET_ACCOUNT':
      return {
        ...state,
        account: action.account,
      }
    case 'SET_CHAIN_ID':
      return {
        ...state,
        chainId: action.chainId,
      }
    case 'RESET_WEB3_PROVIDER':
      return initialWeb3State
    default:
      throw new Error()
  }
}


export const Web3Context = createContext<{ state: StateType, dispatch: Dispatch<ActionType> | undefined}>({ state: initialWeb3State, dispatch: undefined});
export function useWeb3Context() {
  return useContext(Web3Context);
}