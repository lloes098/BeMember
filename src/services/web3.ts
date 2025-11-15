import { ethers } from 'ethers';

// Monad 체인 네트워크 설정
// TODO: 실제 Monad 체인 RPC URL로 변경 필요
export const MONAD_CHAIN_CONFIG = {
  chainId: 10143, // 0x279F - Monad 테스트넷 Chain ID
  chainName: 'Monad Testnet',
  nativeCurrency: {
    name: 'MON',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: ['https://testnet-rpc.monad.xyz'],
  blockExplorerUrls: ['https://testnet.monadexplorer.com/'],
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
  
  // 계정 연결 요청 (먼저 연결)
  await provider.send('eth_requestAccounts', []);
  
  // 현재 체인 ID 확인
  const network = await provider.getNetwork();
  const currentChainId = Number(network.chainId);
  const monadChainId = MONAD_CHAIN_CONFIG.chainId;
  
  // Monad 테스트넷이 아니면 전환 요청
  if (currentChainId !== monadChainId) {
    try {
      // 먼저 네트워크 전환 시도
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${monadChainId.toString(16)}` }],
      });
    } catch (switchError: any) {
      // 네트워크가 추가되지 않은 경우 추가
      if (switchError.code === 4902 || switchError.code === -32002) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [MONAD_CHAIN_CONFIG],
          });
        } catch (addError: any) {
          throw new Error(
            `Monad 테스트넷으로 전환할 수 없습니다. MetaMask에서 수동으로 전환해주세요.\n` +
            `Chain ID: ${monadChainId} (0x${monadChainId.toString(16)})\n` +
            `RPC URL: ${MONAD_CHAIN_CONFIG.rpcUrls[0]}`
          );
        }
      } else {
        throw new Error(
          `Monad 테스트넷으로 전환할 수 없습니다. MetaMask에서 수동으로 전환해주세요.\n` +
          `현재 네트워크: Chain ID ${currentChainId}\n` +
          `필요한 네트워크: Chain ID ${monadChainId} (Monad Testnet)`
        );
      }
    }
    
    // 전환 후 다시 provider 생성
    return new ethers.BrowserProvider(window.ethereum);
  }
  
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

