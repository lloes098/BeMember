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

  // 컨트랙트 검증 (선택사항 - 블록 익스플로러가 있는 경우)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n⏳ 컨트랙트 검증을 위해 잠시 대기 중...");
    await new Promise((resolve) => setTimeout(resolve, 30000)); // 30초 대기

    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: [],
      });
      console.log("✅ 컨트랙트 검증 완료!");
    } catch (error) {
      console.log("⚠️  컨트랙트 검증 실패 (무시 가능):", error.message);
    }
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

