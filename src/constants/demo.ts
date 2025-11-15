/**
 * 데모 버전용 상수
 * IPFS를 사용하지 않고 고정된 CID와 랜덤 명함 데이터를 사용
 */

// 고정된 CID 값 (데모용)
export const DEMO_CID = 'QmDemo123456789abcdefghijklmnopqrstuvwxyz';

// 랜덤 명함 데이터 생성
export function generateRandomCardData() {
  const names = [
    'Alice Johnson',
    'Bob Smith',
    'Charlie Brown',
    'Diana Prince',
    'Ethan Hunt',
    'Fiona Chen',
    'George Wilson',
    'Hannah Kim',
    'Ian Martinez',
    'Julia Anderson',
  ];

  const roles = [
    'Software Engineer',
    'Product Manager',
    'Designer',
    'Data Scientist',
    'Marketing Director',
    'CEO',
    'CTO',
    'Full Stack Developer',
    'Blockchain Developer',
    'UX Researcher',
  ];

  const companies = [
    'Tech Corp',
    'Innovation Labs',
    'Digital Solutions',
    'Future Systems',
    'Creative Agency',
    'Startup Inc',
    'Global Tech',
    'NextGen Co',
    'Smart Solutions',
    'Visionary Labs',
  ];

  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomRole = roles[Math.floor(Math.random() * roles.length)];
  const randomCompany = companies[Math.floor(Math.random() * companies.length)];

  return {
    name: randomName,
    tagline: `${randomRole} at ${randomCompany}`,
    role: randomRole,
    organization: randomCompany,
    email: `${randomName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    phone: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    website: `https://${randomCompany.toLowerCase().replace(/\s+/g, '')}.com`,
    twitter: `@${randomName.toLowerCase().replace(/\s+/g, '')}`,
    github: randomName.toLowerCase().replace(/\s+/g, ''),
    createdAt: new Date().toISOString(),
  };
}

