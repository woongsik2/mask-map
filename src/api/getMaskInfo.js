import axios from "axios";

// 주소입력으로 정보 획득
export async function getAddrMaskInfo(){
    let result = await axios.get("/storesByAddr/json", {
          params: {
            address: "서울특별시 강남구"
          }
        });
    return result
}

// 위경도로 정보 획득
export async function getLongitudeMaskInfo(latitude, longitude,){
    let result = await axios.get("/storesByGeo/json", {
          params: {
            lat1: latitude,
            lng1: longitude,
            lat: 33.498619383750544,
            lng: 126.5329107465822,
            m: 5000
          }
        });
    return result
}