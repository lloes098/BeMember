/**
 * 명함 정보를 관리하는 클래스
 * CreateCard와 ScanCard에서 공통으로 사용
 */
export class BusinessCard {
  // 필수 필드
  public name: string;
  
  // 기본 정보
  public tagline?: string;
  public role?: string;
  public title?: string;
  public organization?: string;
  public company?: string; // ScanCard에서 사용
  
  // 연락처 정보
  public email?: string;
  public phone?: string;
  public website?: string;
  
  // 소셜 미디어
  public ens?: string;
  public farcaster?: string;
  public twitter?: string;
  public github?: string;
  
  // 기타
  public profileImage?: string;
  public isTransferable?: boolean;
  public createdAt?: string;
  
  // 블록체인 관련
  public cid?: string; // IPFS CID
  public address?: string; // 지갑 주소
  public txHash?: string; // 트랜잭션 해시

  constructor(data?: Partial<BusinessCard>) {
    this.name = data?.name || '';
    this.tagline = data?.tagline;
    this.role = data?.role;
    this.title = data?.title;
    this.organization = data?.organization;
    this.company = data?.company;
    this.email = data?.email;
    this.phone = data?.phone;
    this.website = data?.website;
    this.ens = data?.ens;
    this.farcaster = data?.farcaster;
    this.twitter = data?.twitter;
    this.github = data?.github;
    this.profileImage = data?.profileImage;
    this.isTransferable = data?.isTransferable || false;
    this.createdAt = data?.createdAt || new Date().toISOString();
    this.cid = data?.cid;
    this.address = data?.address;
    this.txHash = data?.txHash;
  }

  /**
   * CreateCard의 formData에서 BusinessCard 인스턴스 생성
   */
  static fromCreateCardForm(formData: {
    name: string;
    tagline?: string;
    role?: string;
    organization?: string;
    website?: string;
    ens?: string;
    farcaster?: string;
    twitter?: string;
    github?: string;
    isTransferable?: boolean;
  }): BusinessCard {
    return new BusinessCard({
      name: formData.name,
      tagline: formData.tagline,
      role: formData.role,
      organization: formData.organization,
      website: formData.website,
      ens: formData.ens,
      farcaster: formData.farcaster,
      twitter: formData.twitter,
      github: formData.github,
      isTransferable: formData.isTransferable,
      createdAt: new Date().toISOString(),
    });
  }

  /**
   * ScanCard의 extractedData에서 BusinessCard 인스턴스 생성
   */
  static fromScannedData(scannedData: {
    name?: string;
    email?: string;
    phone?: string;
    title?: string;
    company?: string;
    website?: string;
  }): BusinessCard {
    return new BusinessCard({
      name: scannedData.name || '',
      email: scannedData.email,
      phone: scannedData.phone,
      title: scannedData.title,
      role: scannedData.title, // title을 role로도 매핑
      company: scannedData.company,
      organization: scannedData.company, // company를 organization으로도 매핑
      website: scannedData.website,
      tagline: scannedData.title 
        ? `${scannedData.title}${scannedData.company ? ` at ${scannedData.company}` : ''}`
        : undefined,
      createdAt: new Date().toISOString(),
    });
  }

  /**
   * IPFS 업로드용 JSON 데이터로 변환
   */
  toIPFSData(): {
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
  } {
    return {
      name: this.name,
      title: this.title,
      tagline: this.tagline,
      role: this.role,
      organization: this.organization || this.company,
      email: this.email,
      phone: this.phone,
      website: this.website,
      ens: this.ens,
      farcaster: this.farcaster,
      twitter: this.twitter,
      github: this.github,
      profileImage: this.profileImage,
      isTransferable: this.isTransferable,
      createdAt: this.createdAt,
    };
  }

  /**
   * IPFS에서 가져온 데이터로부터 BusinessCard 인스턴스 생성
   */
  static fromIPFSData(data: {
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
  }): BusinessCard {
    return new BusinessCard(data);
  }

  /**
   * CreateCard formData 형식으로 변환
   */
  toCreateCardForm(): {
    name: string;
    tagline: string;
    role: string;
    organization: string;
    ens: string;
    farcaster: string;
    twitter: string;
    website: string;
    github: string;
  } {
    return {
      name: this.name,
      tagline: this.tagline || '',
      role: this.role || '',
      organization: this.organization || this.company || '',
      ens: this.ens || '',
      farcaster: this.farcaster || '',
      twitter: this.twitter || '',
      website: this.website || '',
      github: this.github || '',
    };
  }

  /**
   * 유효성 검사
   */
  isValid(): boolean {
    return !!this.name && !!this.tagline;
  }

  /**
   * 필수 필드 확인
   */
  getMissingFields(): string[] {
    const missing: string[] = [];
    if (!this.name) missing.push('name');
    if (!this.tagline) missing.push('tagline');
    return missing;
  }

  /**
   * JSON으로 직렬화
   */
  toJSON(): string {
    return JSON.stringify(this.toIPFSData(), null, 2);
  }

  /**
   * JSON에서 역직렬화
   */
  static fromJSON(json: string): BusinessCard {
    const data = JSON.parse(json);
    return BusinessCard.fromIPFSData(data);
  }

  /**
   * vCard 형식으로 변환
   */
  toVCard(): string {
    const lines: string[] = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${this.name}`,
    ];

    if (this.email) lines.push(`EMAIL:${this.email}`);
    if (this.phone) lines.push(`TEL:${this.phone}`);
    if (this.title || this.role) lines.push(`TITLE:${this.title || this.role}`);
    if (this.organization || this.company) {
      lines.push(`ORG:${this.organization || this.company}`);
    }
    if (this.website) lines.push(`URL:${this.website}`);

    lines.push('END:VCARD');
    return lines.join('\n');
  }

  /**
   * 복사본 생성
   */
  clone(): BusinessCard {
    return new BusinessCard({
      name: this.name,
      tagline: this.tagline,
      role: this.role,
      title: this.title,
      organization: this.organization,
      company: this.company,
      email: this.email,
      phone: this.phone,
      website: this.website,
      ens: this.ens,
      farcaster: this.farcaster,
      twitter: this.twitter,
      github: this.github,
      profileImage: this.profileImage,
      isTransferable: this.isTransferable,
      createdAt: this.createdAt,
      cid: this.cid,
      address: this.address,
      txHash: this.txHash,
    });
  }
}

