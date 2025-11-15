# 스마트 컨트랙트 배포 가이드

## 📋 사전 준비

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음 정보를 입력하세요:

```env
# Monad 테스트넷 RPC URL
MONAD_TESTNET_RPC_URL=https://testnet-rpc.monad.xyz

# Monad 메인넷 RPC URL (선택사항)
MONAD_MAINNET_RPC_URL=https://rpc.monad.xyz

# 기본 RPC URL (테스트넷 우선)
MONAD_RPC_URL=https://testnet-rpc.monad.xyz

# 배포용 지갑 개인키 (절대 공개하지 마세요!)
# 0x 접두사 포함 또는 제외 모두 가능
PRIVATE_KEY=0xyour_private_key_here

# 배포 후 자동으로 설정됨
VITE_CONTRACT_ADDRESS=
```

**⚠️ 주의사항:**
- `.env` 파일은 절대 Git에 커밋하지 마세요!
- 개인키는 안전하게 보관하세요.

## 🔨 컴파일

컨트랙트를 컴파일하여 바이트코드와 ABI를 생성합니다:

```bash
npm run compile
```

컴파일 성공 시:
- `artifacts/contracts/BusinessCard.sol/BusinessCard.json` 생성
- ABI와 바이트코드 포함

## 🚀 배포

### Monad 테스트넷에 배포

```bash
npm run deploy:monad
```

또는 명시적으로 테스트넷 지정:

```bash
npx hardhat run scripts/deploy.js --network monadTestnet
```

### Monad 메인넷에 배포 (준비되면)

```bash
npx hardhat run scripts/deploy.js --network monadMainnet
```

### 로컬 네트워크에 배포 (테스트용)

먼저 Hardhat 로컬 노드 실행:
```bash
npx hardhat node
```

다른 터미널에서:
```bash
npm run deploy:local
```

## 📝 배포 후 작업

### 1. 컨트랙트 주소 복사

배포 성공 시 출력된 컨트랙트 주소를 복사하세요:
```
✅ BusinessCard 컨트랙트 배포 완료!
📍 컨트랙트 주소: 0x...
```

### 2. 환경 변수 업데이트

`.env` 파일에 컨트랙트 주소 추가:

```env
VITE_CONTRACT_ADDRESS=0x배포된_주소
```

### 3. 프론트엔드 재시작

환경 변수 변경 후 개발 서버 재시작:

```bash
npm run dev
```

## 🔍 컨트랙트 검증 (Sourcify)

Monad 테스트넷은 Sourcify를 사용하여 컨트랙트를 검증합니다.

### 수동 검증 방법

1. **Monad Explorer 접속**
   - https://testnet.monadexplorer.com/ 접속
   - 배포된 컨트랙트 주소 검색

2. **컨트랙트 소스 코드 업로드**
   - "Verify Contract" 버튼 클릭
   - `contracts/BusinessCard.sol` 파일 업로드
   - 또는 컴파일된 메타데이터 사용

3. **검증 확인**
   - 검증 성공 시 컨트랙트 소스 코드가 공개됩니다

### Sourcify API 정보

- **API URL**: https://sourcify-api-monad.blockvision.org/
- **Browser URL**: https://testnet.monadexplorer.com/

### Monad 테스트넷 정보

- **RPC URL**: https://testnet-rpc.monad.xyz
- **Chain ID**: 10143 (0x279F)
- **Faucet**: https://testnet.monad.xyz (테스트넷 토큰 받기)

## 📊 컨트랙트 정보

### BusinessCard.sol

**주요 함수:**
- `uploadCard(string memory _cid)`: IPFS CID 업로드
- `getCardCID(address _user)`: 특정 주소의 CID 조회
- `myCardCID()`: 내 CID 조회

**이벤트:**
- `CardUploaded(address indexed user, string cid)`: CID 업로드 시 발생

## 🛠️ 트러블슈팅

### 배포 실패 시

1. **가스비 부족**: 지갑에 충분한 MON 토큰이 있는지 확인
2. **네트워크 연결 실패**: RPC URL이 올바른지 확인
3. **개인키 오류**: `.env` 파일의 `PRIVATE_KEY` 형식 확인 (0x 접두사 포함/제외 모두 가능)

### 컴파일 오류 시

1. Solidity 버전 확인: `hardhat.config.js`와 `BusinessCard.sol`의 버전 일치 확인
2. 의존성 재설치: `rm -rf node_modules && npm install`

## 📚 참고 자료

- [Hardhat 문서](https://hardhat.org/docs)
- [Solidity 문서](https://docs.soliditylang.org/)
- [Monad 체인 문서](https://docs.monad.xyz/) (실제 문서 URL 확인 필요)

