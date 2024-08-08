/**
 * @brief 지갑 API 타입 정의
 */


/**
 * @brief 승급 재료 NFT 리스트
 * @author Nibble
 */
type ResponseNftMaterials = {
  totalCount: number,
  nfts: ResponseNftMaterial[]
}

/**
 * @brief 승급 재료 NFT 데이터
 * @author Nibble
 */
type ResponseNftMaterial = {
  seqNo: number,
  name: string,
  grade: number,
  level: number,
  playerCode: number,
  seasonCode: number,
  birdie: number
}