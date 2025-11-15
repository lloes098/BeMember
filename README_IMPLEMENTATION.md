# Monad 체인 + IPFS 명함 시스템 구현 가이드

## 📋 구현 완료 사항

### 1. 라이브러리 설치
- ✅ `ethers` (v6.13.0) - Web3 라이브러리
- ✅ `ipfs-http-client` (v60.0.1) - IPFS 클라이언트

### 2. 서비스 레이어 구현

#### `src/services/ipfs.ts`
- IPFS 클라이언트 초기화 (Infura 또는 공개 Gateway)
- `uploadCardToIPFS()` - 명함 데이터를 IPFS에 업로드하고 CID 반환
- `getCardFromIPFS()` - CID로 IPFS에서 명함 데이터 가져오기
- `getIPFSGatewayURL()` - IPFS Gateway URL 생성

#### `src/services/web3.ts`
- `connectWallet()` - MetaMask 지갑 연결 및 Monad 체인 네트워크 추가
- `getWalletAddress()` - 현재 연결된 지갑 주소 가져오기
- `checkWalletConnection()` - 지갑 연결 상태 확인
- `setupWalletListeners()` - 지갑 이벤트 리스너 설정

#### `src/contracts/BusinessCard.ts`
- 스마트 계약 ABI 정의
- `uploadCard(cid)` - CID 업로드 함수
- `getCardCID(address)` - 주소로 CID 조회
- `myCardCID()` - 내 CID 조회

### 3. 컴포넌트 연동

#### `CreateCard.tsx`
- ✅ IPFS에 명함 데이터 업로드
- ✅ 스마트 계약에 CID 기록
- ✅ 트랜잭션 확인 대기
- ✅ 에러 처리 및 토스트 알림

#### `CardView.tsx`
- ✅ 스마트 계약에서 CID 조회
- ✅ IPFS에서 명함 데이터 다운로드
- ✅ 로딩 상태 표시
- ✅ 에러 처리

#### `App.tsx`
- ✅ 실제 지갑 연결 구현

## 🔧 설정 필요 사항

### 1. 환경 변수 설정

프로젝트 루트에 `.env` 파일 생성:

```env
# Infura IPFS (선택사항 - 없으면 공개 Gateway 사용)
VITE_INFURA_PROJECT_ID=your_project_id
VITE_INFURA_PROJECT_SECRET=your_project_secret

# 스마트 계약 주소 (배포 후 업데이트)
VITE_CONTRACT_ADDRESS=0x...
```

### 2. Monad 체인 네트워크 설정

`src/services/web3.ts` 파일에서 Monad 체인 설정 확인:

```typescript
export const MONAD_CHAIN_CONFIG = {
  chainId: 0x1a4, // 실제 Monad 체인 ID로 변경
  chainName: 'Monad Testnet',
  rpcUrls: ['https://testnet-rpc.monad.xyz'], // 실제 RPC URL로 변경
  blockExplorerUrls: ['https://testnet-explorer.monad.xyz'], // 실제 Explorer URL로 변경
};
```

### 3. 스마트 계약 배포

#### Solidity 스마트 계약 예시:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BusinessCard {
    mapping(address => string) public businessCardCID;
    
    event CardUploaded(address indexed user, string cid);
    
    function uploadCard(string memory _cid) public {
        businessCardCID[msg.sender] = _cid;
        emit CardUploaded(msg.sender, _cid);
    }
    
    function getCardCID(address _user) public view returns (string memory) {
        return businessCardCID[_user];
    }
    
    function myCardCID() public view returns (string memory) {
        return businessCardCID[msg.sender];
    }
}
```

#### 배포 후:
1. 스마트 계약 주소를 `.env` 파일의 `VITE_CONTRACT_ADDRESS`에 설정
2. `src/services/web3.ts`의 `BUSINESS_CARD_CONTRACT_ADDRESS` 확인

## 📊 데이터 흐름

### 명함 업로드 플로우:
```
1. 사용자 입력 (CreateCard)
   ↓
2. JSON 데이터 생성
   ↓
3. IPFS 업로드 → CID 반환
   ↓
4. 스마트 계약에 CID 기록 (uploadCard)
   ↓
5. 트랜잭션 확인 대기
   ↓
6. 완료!
```

### 명함 조회 플로우:
```
1. 지갑 주소 입력 (CardView)
   ↓
2. 스마트 계약에서 CID 조회 (getCardCID)
   ↓
3. IPFS에서 CID로 데이터 가져오기
   ↓
4. 명함 데이터 표시
```

## 🚀 사용 방법

### 1. 명함 생성
1. 지갑 연결
2. "Create My Onchain Card" 클릭
3. 정보 입력
4. "Create My Onchain Card" 버튼 클릭
5. IPFS 업로드 → 스마트 계약 트랜잭션 확인

### 2. 명함 조회
1. 지갑 주소로 명함 조회
2. 스마트 계약에서 CID 자동 조회
3. IPFS에서 데이터 자동 로드

## ⚠️ 주의사항

1. **IPFS 인증**: Infura를 사용하려면 프로젝트 ID와 Secret이 필요합니다. 없으면 공개 Gateway를 사용합니다.

2. **네트워크 설정**: Monad 체인의 실제 RPC URL과 Chain ID를 확인하여 업데이트해야 합니다.

3. **스마트 계약**: 스마트 계약을 배포한 후 주소를 환경 변수에 설정해야 합니다.

4. **에러 처리**: 네트워크 오류, IPFS 오류, 스마트 계약 오류 등에 대한 적절한 에러 처리가 구현되어 있습니다.

## 🔗 참고 자료

- [Ethers.js 문서](https://docs.ethers.org/)
- [IPFS HTTP Client 문서](https://github.com/ipfs/js-ipfs/tree/master/packages/ipfs-http-client)
- [Monad 체인 문서](https://docs.monad.xyz/) (실제 문서 URL 확인 필요)

