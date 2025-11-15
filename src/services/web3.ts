import { ethers } from 'ethers';

// Monad 체인 네트워크 설정
// TODO: 실제 Monad 체인 RPC URL로 변경 필요
export const MONAD_CHAIN_CONFIG = {
  chainId: 0x1a4, // Monad 테스트넷 (실제 체인 ID 확인 필요)
  chainName: 'Monad Testnet',
  nativeCurrency: {
    name: 'MON',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: ['https://testnet-rpc.monad.xyz'], // 실제 RPC URL로 변경 필요
  blockExplorerUrls: ['https://testnet-explorer.monad.xyz'], // 실제 Explorer URL로 변경 필요
};

// 스마트 계약 주소 (배포 후 업데이트 필요)
export const BUSINESS_CARD_CONTRACT_ADDRESS = (import.meta as any).env?.VITE_CONTRACT_ADDRESS || '';

/**
 * 지갑 연결
 */
export async function connectWallet(): Promise<ethers.BrowserProvider> {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask가 설치되어 있지 않습니다. MetaMask를 설치해주세요.');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  
  // Monad 체인으로 네트워크 전환 시도
  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [MONAD_CHAIN_CONFIG],
    });
  } catch (error: any) {
    // 이미 추가되어 있거나 사용자가 거부한 경우 무시
    if (error.code !== 4902 && error.code !== -32002) {
      console.warn('네트워크 추가 실패:', error);
    }
  }

  // 계정 연결 요청
  await provider.send('eth_requestAccounts', []);
  
  return provider;
}

/**
 * 현재 연결된 지갑 주소 가져오기
 */
export async function getWalletAddress(): Promise<string> {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask가 설치되어 있지 않습니다.');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return await signer.getAddress();
}

/**
 * 지갑 연결 상태 확인
 */
export async function checkWalletConnection(): Promise<string | null> {
  if (typeof window.ethereum === 'undefined') {
    return null;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.listAccounts();
    return accounts.length > 0 ? accounts[0].address : null;
  } catch (error) {
    return null;
  }
}

/**
 * 지갑 이벤트 리스너 설정
 */
export function setupWalletListeners(
  onAccountsChanged: (accounts: string[]) => void,
  onChainChanged: (chainId: string) => void
) {
  if (typeof window.ethereum === 'undefined') {
    return;
  }

  window.ethereum.on('accountsChanged', (accounts: string[]) => {
    onAccountsChanged(accounts);
  });

  window.ethereum.on('chainChanged', (chainId: string) => {
    onChainChanged(chainId);
  });

  return () => {
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', onAccountsChanged);
      window.ethereum.removeListener('chainChanged', onChainChanged);
    }
  };
}

// Window 객체에 ethereum 타입 추가
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, handler: (...args: any[]) => void) => void;
      removeListener: (event: string, handler: (...args: any[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}

