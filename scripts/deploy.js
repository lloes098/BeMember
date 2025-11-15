const hre = require("hardhat");

async function main() {
  console.log("🚀 BusinessCard 컨트랙트 배포 시작...");

  // 컨트랙트 팩토리 가져오기
  const BusinessCard = await hre.ethers.getContractFactory("BusinessCard");

  // 컨트랙트 배포
  console.log("📦 컨트랙트 배포 중...");
  const businessCard = await BusinessCard.deploy();

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

