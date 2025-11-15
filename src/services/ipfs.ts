import { create } from 'ipfs-http-client';

// Web3.Storage API 토큰 (무료 티어: 5GB)
const getWeb3StorageToken = () => {
  try {
    return (import.meta as any).env?.VITE_WEB3_STORAGE_TOKEN || '';
  } catch {
    return '';
  }
};

// Infura IPFS (옵션 - 유료)
const getInfuraProjectId = () => {
  try {
    return (import.meta as any).env?.VITE_INFURA_PROJECT_ID || '';
  } catch {
    return '';
  }
};

const getInfuraProjectSecret = () => {
  try {
    return (import.meta as any).env?.VITE_INFURA_PROJECT_SECRET || '';
  } catch {
    return '';
  }
};

// IPFS 클라이언트 초기화 (Infura 사용 시)
const projectId = getInfuraProjectId();
const projectSecret = getInfuraProjectSecret();

const ipfsClient = projectId && projectSecret ? create({
  url: 'https://ipfs.infura.io:5001/api/v0',
  headers: {
    authorization: `Basic ${btoa(`${projectId}:${projectSecret}`)}`,
  },
}) : null;

// 공개 IPFS Gateway 사용 (인증 불필요 - 읽기 전용)
const publicIpfsClient = create({
  url: 'https://ipfs.infura.io:5001/api/v0',
});

// 환경 변수가 있으면 인증된 클라이언트, 없으면 공개 클라이언트 사용
const client = ipfsClient || publicIpfsClient;

export interface BusinessCardData {
  name: string;
  title?: string;
  tagline?: string;
  role?: string;
  organization?: string;
  email?: string;
  phone?: string;
  website?: string;
  ens?: string;
  farcaster?: string;
  twitter?: string;
  github?: string;
  profileImage?: string;
  isTransferable?: boolean;
  createdAt?: string;
}

/**
 * 명함 데이터를 IPFS에 업로드하고 CID 반환
 */
export async function uploadCardToIPFS(cardData: BusinessCardData): Promise<string> {
  try {
    // JSON 데이터를 문자열로 변환
    const jsonString = JSON.stringify(cardData, null, 2);
    
    // IPFS에 업로드
    const result = await client.add(jsonString, {
      pin: true, // IPFS에 고정 (pin)
    });

    // CID 반환
    return result.cid.toString();
  } catch (error) {
    console.error('IPFS 업로드 실패:', error);
    throw new Error('IPFS 업로드에 실패했습니다. 다시 시도해주세요.');
  }
}

/**
 * CID로 IPFS에서 명함 데이터 가져오기
 */
export async function getCardFromIPFS(cid: string): Promise<BusinessCardData> {
  try {
    // IPFS에서 데이터 가져오기
    const chunks: Uint8Array[] = [];
    for await (const chunk of client.cat(cid)) {
      chunks.push(chunk);
    }

    // Uint8Array 배열을 하나로 합치기
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }

    // 텍스트로 디코딩
    const text = new TextDecoder().decode(result);
    
    // JSON 파싱
    const cardData = JSON.parse(text) as BusinessCardData;
    
    return cardData;
  } catch (error) {
    console.error('IPFS 다운로드 실패:', error);
    throw new Error(`CID ${cid}로 데이터를 가져올 수 없습니다.`);
  }
}

/**
 * 이미지 파일을 IPFS에 업로드하고 CID 반환
 * Web3.Storage (무료) 우선 사용, 없으면 Infura 사용
 * @param file - 업로드할 이미지 파일 (File 객체)
 * @returns CID 문자열
 */
export async function uploadImageToIPFS(file: File): Promise<string> {
  const web3StorageToken = getWeb3StorageToken();
  
  // Web3.Storage 사용 (무료, 우선)
  if (web3StorageToken) {
    try {
      console.log('Web3.Storage를 사용하여 업로드 중...');
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://api.web3.storage/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${web3StorageToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Web3.Storage 업로드 실패:', errorText);
        throw new Error(`Web3.Storage 업로드 실패: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      // Web3.Storage 응답 형식: { cid: "..." } 또는 다른 형식일 수 있음
      const cid = result.cid || result.ipfs || result;
      
      if (!cid || typeof cid !== 'string') {
        console.error('Web3.Storage 응답:', result);
        throw new Error('CID를 받지 못했습니다. 응답 형식을 확인해주세요.');
      }

      console.log('Web3.Storage 업로드 성공, CID:', cid);
      return cid;
    } catch (error: any) {
      console.error('Web3.Storage 업로드 실패:', error);
      // Web3.Storage 실패 시 Infura로 폴백
      if (ipfsClient) {
        console.log('Infura로 폴백 시도...');
      } else {
        throw new Error('이미지 업로드에 실패했습니다. Web3.Storage 토큰을 확인해주세요.');
      }
    }
  }

  // Infura 사용 (폴백 또는 Web3.Storage 토큰이 없을 때)
  if (ipfsClient) {
    try {
      console.log('Infura IPFS를 사용하여 업로드 중...');
      const result = await ipfsClient.add(file, {
        pin: true, // IPFS에 고정 (pin)
      });
      const cid = result.cid.toString();
      console.log('Infura 업로드 성공, CID:', cid);
      return cid;
    } catch (error) {
      console.error('Infura IPFS 업로드 실패:', error);
      throw new Error('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
    }
  }

  // 둘 다 없으면 에러
  throw new Error(
    'IPFS 업로드를 위한 설정이 없습니다. ' +
    'Web3.Storage 토큰(VITE_WEB3_STORAGE_TOKEN) 또는 ' +
    'Infura 키(VITE_INFURA_PROJECT_ID, VITE_INFURA_PROJECT_SECRET)를 설정해주세요.'
  );
}

/**
 * IPFS Gateway URL 생성 (브라우저에서 직접 접근 가능)
 */
export function getIPFSGatewayURL(cid: string): string {
  // 여러 IPFS Gateway 옵션
  const gateways = [
    `https://ipfs.io/ipfs/${cid}`,
    `https://gateway.pinata.cloud/ipfs/${cid}`,
    `https://cloudflare-ipfs.com/ipfs/${cid}`,
  ];
  
  return gateways[0]; // 기본적으로 ipfs.io 사용
}

