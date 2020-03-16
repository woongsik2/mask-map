import axios from "axios";

let maskApiBaseUrl = 'https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1'
// 주소입력으로 정보 획득
/**
  주소를 기준으로 해당 구 또는 동내에 존재하는 판매처 및 재고 상태 등의 판매 정보 제공.
  예- '서울특별시 강남구' or '서울특별시 강남구 논현동'
  ('서울특별시' 와 같이 '시'단위만 입력하는 것은 불가능합니다.)
*/
export async function getAddrMaskInfo(address){
    let result = await axios.get(`${maskApiBaseUrl}/storesByAddr/json`, {
          params: {
            address
          }
        });
    return result
}

// 위경도로 정보 획득
export async function getLongitudeMaskInfo(lat, lng, m){
  let result = await axios.get(`${maskApiBaseUrl}/storesByGeo/json`, {
      params: {
        lat,
        lng,
        m
      }
    });
    return result
}