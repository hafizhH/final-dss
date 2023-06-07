
export const csvStringToArray = strData => {
  const objPattern = new RegExp(("(\\,|\\r?\\n|\\r|^)(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|([^\\,\\r\\n]*))"),"gi");
  let arrMatches = null, arrData = [[]];
  while (arrMatches = objPattern.exec(strData)){
    if (arrMatches[1].length && arrMatches[1] !== ",")
      arrData.push([])
    arrData[arrData.length - 1].push(arrMatches[2] ? arrMatches[2].replace(new RegExp( "\"\"", "g" ), "\"") : arrMatches[3]);
  }
  return arrData;
}

const deg2Rad = (deg) => deg * (Math.PI / 180)

export const haversineDistance = (coord1, coord2) => {
  const {lat: lat1, long: lon1} = coord1
  const {lat: lat2, long: lon2} = coord2
  let R = 6371 // km 
  let x1 = lat2-lat1
  let dLat = deg2Rad(x1)
  let x2 = lon2-lon1
  let dLon = deg2Rad(x2)
  let a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2Rad(lat1)) * Math.cos(deg2Rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2)  
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) 
  let d = R * c
  return d
}