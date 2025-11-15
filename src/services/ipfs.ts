import { create } from 'ipfs-http-client';

// IPFS 클라이언트 초기화
// Infura IPFS Gateway 사용 (무료 티어 사용 가능)
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

const projectId = getInfuraProjectId();
const projectSecret = getInfuraProjectSecret();

const ipfsClient = projectId && projectSecret ? create({
  url: 'https://ipfs.infura.io:5001/api/v0',
  headers: {
    authorization: `Basic ${btoa(`${projectId}:${projectSecret}`)}`,
  },
}) : null;

// 공개 IPFS Gateway 사용 (인증 불필요)
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

