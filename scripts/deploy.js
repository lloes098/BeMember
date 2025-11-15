const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🚀 BusinessCard 컨트랙트 배포 시작...");
  console.log("🌐 네트워크:", hre.network.name);

  // 환경 변수 확인
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error(
      "❌ PRIVATE_KEY 환경 변수가 설정되지 않았습니다.\n" +
      "💡 프로젝트 루트에 .env 파일을 생성하고 다음을 추가하세요:\n" +
      "   PRIVATE_KEY=0x여기에_개인키_입력"
    );
  }

  // 네트워크 설정 확인
  const networkConfig = hre.config.networks[hre.network.name];
  if (!networkConfig) {
    throw new Error(`❌ 네트워크 설정을 찾을 수 없습니다: ${hre.network.name}`);
  }

  console.log("📋 네트워크 설정:");
  console.log("   - RPC URL:", networkConfig.url);
  console.log("   - Chain ID:", networkConfig.chainId);
  console.log("   - Accounts 설정:", networkConfig.accounts?.length || 0, "개");

  // Signer 가져오기 (배포에 필요)
  const signers = await hre.ethers.getSigners();
  
  if (signers.length === 0) {
    throw new Error(
      "❌ 배포자 지갑을 찾을 수 없습니다.\n" +
      "💡 hardhat.config.js의 accounts 설정을 확인해주세요.\n" +
      "   PRIVATE_KEY가 올바르게 설정되어 있는지 확인하세요."
    );
  }

  const deployer = signers[0];
  console.log("👤 배포자 주소:", deployer.address);

  // 잔액 확인
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 잔액:", hre.ethers.formatEther(balance), "MON");

  // 잔액이 부족한 경우 경고
  if (balance === 0n) {
    console.log("⚠️  경고: 잔액이 0입니다. 테스트넷 토큰을 받아주세요:");
    console.log("   https://testnet.monad.xyz");
  }

  // 현재 가스 가격 확인
  const feeData = await hre.ethers.provider.getFeeData();
  console.log("⛽ 가스 정보:");
  if (feeData.gasPrice) {
    console.log("   - Gas Price:", hre.ethers.formatUnits(feeData.gasPrice, "gwei"), "gwei");
  }
  if (feeData.maxFeePerGas) {
    console.log("   - Max Fee Per Gas:", hre.ethers.formatUnits(feeData.maxFeePerGas, "gwei"), "gwei");
  }

  // 컨트랙트 팩토리 가져오기
  const BusinessCard = await hre.ethers.getContractFactory("BusinessCard", deployer);

  // 컨트랙트 배포 (가스 가격 옵션 포함)
  console.log("📦 컨트랙트 배포 중...");
  const deployOptions = {};
  
  // 가스 가격 설정 (네트워크 설정 또는 동적 가격 사용)
  if (feeData.gasPrice) {
    // 최소 10 gwei 보장
    const minGasPrice = hre.ethers.parseUnits("10", "gwei");
    deployOptions.gasPrice = feeData.gasPrice > minGasPrice ? feeData.gasPrice : minGasPrice;
    console.log("   - 사용할 Gas Price:", hre.ethers.formatUnits(deployOptions.gasPrice, "gwei"), "gwei");
  }
  
  const businessCard = await BusinessCard.deploy(deployOptions);

  // 배포 완료 대기
  await businessCard.waitForDeployment();

  const address = await businessCard.getAddress();
  console.log("✅ BusinessCard 컨트랙트 배포 완료!");
  console.log("📍 컨트랙트 주소:", address);
  console.log("🌐 네트워크:", hre.network.name);

  // 배포 정보 저장 (선택사항)
  console.log("\n📋 다음 정보를 .env 파일에 추가하세요:");
  console.log(`VITE_CONTRACT_ADDRESS=${address}`);

  // Sourcify 검증 안내 (Monad 테스트넷)
  if (hre.network.name === "monad" || hre.network.name === "monadTestnet") {
    console.log("\n📝 Sourcify 검증 안내:");
    console.log("🔗 수동 검증: https://testnet.monadexplorer.com/");
    console.log("📍 컨트랙트 주소:", address);
    console.log("💡 Sourcify API: https://sourcify-api-monad.blockvision.org/");
    console.log("\n⚠️  자동 검증은 수동으로 진행해주세요.");
  }

  return address;
}

main()
  .then((address) => {
    console.log("\n🎉 배포 성공! 컨트랙트 주소:", address);
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ 배포 실패:", error);
    process.exit(1);
  });

