import { ethers } from 'ethers';

// BusinessCard 스마트 계약 ABI
export const BUSINESS_CARD_ABI = [
  // CID 업로드
  {
    inputs: [
      {
        internalType: 'string',
        name: '_cid',
        type: 'string',
      },
    ],
    name: 'uploadCard',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // CID 조회
  {
    inputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
    ],
    name: 'getCardCID',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  // 내 CID 조회
  {
    inputs: [],
    name: 'myCardCID',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  // CID 업데이트 이벤트
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'cid',
        type: 'string',
      },
    ],
    name: 'CardUploaded',
    type: 'event',
  },
] as const;

// 스마트 계약 인터페이스 타입
export interface BusinessCardContract {
  uploadCard(cid: string): Promise<ethers.ContractTransactionResponse>;
  getCardCID(userAddress: string): Promise<string>;
  myCardCID(): Promise<string>;
}

