export const CLOSE_WEBVIEW_MESSAGE = "CLOSE_WEBVIEW_MESSAGE"

export interface ISuccessData {}

// GET
// /spendings
// 스펜딩 기본 정보 조회
export interface ISpendingInfo {
    bdst: number
    tbora: number
    trainingPoint: number
    nftCount: number
    gasFee: number
    doHaveWallet: boolean
}

// GET
// /spendings/tokens/transfer/list
// 스펜딩 거래 내역 조회
export interface ITransferHistoryList {
    totalCount: number
    tokenTransferHistoryList: ITransferHistory[]
}

export interface ITransferHistory {
    status: string
    walletAddress: string
    tokenSymbol: string
    amount: number
    createDt: string
}

// POST
// /spendings/tokens/transfer/wallets
// 스펜딩 => 지갑으로 토큰 전송

// req
// {
//     "serviceMoney": "vx_tBora",
//     "toSymbol": "AVCD",
//     "amount": 0.01
//   }

//res

//unknown

// POST
// /spendings/nfts/transfer/wallets
// 스펜딩 => 지갑으로 NFT 전송 (내보내기)

//req

// {
//     "userNftSeq": 0
//   }

//res

//unknown

// POST
// /wallets/wallet-address
// 해당 유저 지갑 정보 저장

// {
//     "walletAddress": "test"
//   }

//res

//unknown

// GET
// /wallets
// 지갑에 있는 NFT 수량, 토큰 수량 조회

export interface IWalletInfo {
    bdst: number
    tbora: number
    nftCount: number
}

// POST
// /wallets/nfts/transfer/spendings
// 지갑 => 스펜딩으로 NFT 전송 (가져오기)

//req
// {
//     "nftId": 0
//   }

//res
//ISuccessData

// POST
// /wallets/nfts/transfer/result
// 지갑 => 스펜딩으로 NFT 전송 결과 저장

//req
// {
//     "nftId": "212",
//     "nftHistorySeq": "81",
//     "txHash": "t1254961a613f03b8e416969a9bbefde029497e3dd4a58fdaa3"
//   }

//res

//unknown

// GET
// /wallets/nfts
// 지갑에 등록되어있는 NFT 리스트 조회

export interface IWalletRegistNFTList {
    currentPage: number
    lastPage: number
    perPage: number
    total: number
    nfts: IWalletRegistNFT[]
}

export interface IWalletRegistNFT {
    uuid: number
    id: string
    title: string
    image: string
    ownerAddress: string
    status: string
    contract: string
    network: string
    sale: {
        id: number
        price: string
        symbol: string
        localPrice: string
        status: string
    }
    properties: {
        trait_type: string
        value: number | string
        max_value?: number
    }[]
}

// POST
// /nfts/transfer/callback
// NFT 전송 결과 콜백

//req

// {
//     "contract": "CHRYNFT",
//     "network": "CHRYNFT",
//     "token_id": "112",
//     "owner_address": "0x0000000000000000000000000000000000000000",
//     "new_owner_address": "0x0AAAAAAAAAAAAAeee",
//     "updated_at": "2022-04-12 01:23:09",
//     "transaction_hash": "0x0BBBBBBBBBBBBBBeee",
//     "block_number": 100000
//   }

//res

//unknown

// PUT
// /tokens/transfer/callback
// 토큰 전송 콜백

//req

// {
//     "txLogNo": 72,
//     "status": true,
//     "blockStatus": true,
//     "transactionHash": "0xb7166cf8b73f2a325a528a0cf683ac56606a57cfe360d35213f53f8df064d",
//     "inputs": [],
//     "logs": null,
//     "from": "",
//     "blockNumber": "",
//     "blockTimestamp": ""
//   }

//res
// unknown

// PUT
// /tokens/transfer/batch-callback
// 토큰 일괄지급 콜백

// {
//     "txLogNo": 72,
//     "status": true,
//     "blockStatus": true,
//     "transactionHash": "0xb7166cf8b73f2a325a528a0cf683ac56606a57cfe360d35213f53f8df064d",
//     "inputs": [],
//     "logs": null,
//     "from": "",
//     "blockNumber": "",
//     "blockTimestamp": ""
//   }

//res
// unknown
