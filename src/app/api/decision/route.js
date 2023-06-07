import { NextResponse } from "next/server"
import fs from 'fs'
import path from 'path'
import { csvStringToArray, haversineDistance } from "@/app/utils"

export async function POST(request) {
  const { alternativeIds, criterias, optCriterias } = await request.json()

  const fileBuffer = fs.readFileSync(path.join(process.cwd(), '/src/app/data/dataset.csv'))
  const rawData = csvStringToArray(fileBuffer.toString('utf-8'))
  const alternatives = []
  
  for (const [index, row] of rawData.entries()) {
    if (index == 0 || !alternativeIds.includes(row[0]))
      continue
    const lokasi = { lat: parseFloat(row[9]), long: parseFloat(row[10]) }
    alternatives.push({
      id: row[0],
      nama: row[1],
      luas: parseFloat(row[2]),
      harga: parseFloat(row[3]),
      lebar: parseFloat(row[4]),
      kota: parseFloat(row[5]),
      pendidikan: parseFloat(row[6]),
      kesehatan: parseFloat(row[7]),
      perbelanjaan: parseFloat(row[8]),
      optDist: optCriterias.map(c => { const d = haversineDistance(lokasi, c.loc); return (d == 0) ? 0.01 : d }),
      lokasi,
      urlFoto: row[11],
    })
  }

  const altSum = alternatives.reduce((acc, a) => {
    acc['sumLuas'] = acc['sumLuas'] ? acc['sumLuas'] + a.luas : a.luas
    acc['sumHarga'] = acc['sumHarga'] ? acc['sumHarga'] + a.harga : a.harga
    acc['sumLebar'] = acc['sumLebar'] ? acc['sumLebar'] + a.lebar : a.lebar
    acc['sumKota'] = acc['sumKota'] ? acc['sumKota'] + a.kota : a.kota
    acc['sumPendidikan'] = acc['sumPendidikan'] ? acc['sumPendidikan'] + a.pendidikan : a.pendidikan
    acc['sumKesehatan'] = acc['sumKesehatan'] ? acc['sumKesehatan'] + a.kesehatan : a.kesehatan
    acc['sumPerbelanjaan'] = acc['sumPerbelanjaan'] ? acc['sumPerbelanjaan'] + a.perbelanjaan : a.perbelanjaan
    if (acc['sumOptCriterias'] && acc['sumOptCriterias'] > 0) {
      acc['sumOptCriterias'].map((s, index) => s + a.optDist[index])
    } else if (optCriterias && optCriterias.length > 0) {
      acc['sumOptCriterias'] = a.optDist
    }
    return acc
  }, {})

  const cSum = criterias.reduce((acc, c) => acc + c.w, 0) + optCriterias.reduce((acc, c) => acc + c.w, 0)
  const normSignedCriterias = []
  for (const c of criterias) {
    if (c.id != 1 && c.id != 3)   //Assign negative weight to cost criteria
      c.w = -c.w
    c.w /= cSum           //Normalize weight by sum
    normSignedCriterias.push(c)
  }
  for (const c of optCriterias) {
    c.w = -c.w / cSum
    normSignedCriterias.push(c)
  }
  // console.log(normSignedCriterias)
  // console.log(alternatives)

  const normSAlt = []
  for (const [index, alt] of alternatives.entries()) {
    alt.luas = Math.pow((alt.luas / altSum.sumLuas), normSignedCriterias[0].w)
    alt.harga = Math.pow((alt.harga / altSum.sumHarga), normSignedCriterias[1].w)
    alt.lebar = Math.pow((alt.lebar / altSum.sumLebar), normSignedCriterias[2].w)
    alt.kota = Math.pow((alt.kota / altSum.sumKota), normSignedCriterias[3].w)
    alt.pendidikan = Math.pow((alt.pendidikan / altSum.sumPendidikan), normSignedCriterias[4].w)
    alt.kesehatan = Math.pow((alt.kesehatan / altSum.sumKesehatan), normSignedCriterias[5].w)
    alt.perbelanjaan = Math.pow((alt.perbelanjaan / altSum.sumPerbelanjaan), normSignedCriterias[6].w)
    alt.optDist = alt.optDist.map((d, index) => Math.pow(d / altSum.sumOptCriterias[index], normSignedCriterias[7+index].w))
    alt.optDistProduct = alt.optDist.reduce((acc, d) => acc * d, 1)
    alt['product'] = alt.luas * alt.harga * alt.lebar * alt.kota * alt.pendidikan * alt.kesehatan * alt.perbelanjaan * alt.optDistProduct
    normSAlt.push(alt)
  }

  const normSAltProductSum = normSAlt.reduce((acc, a) => acc + a['product'], 0)

  const altRank = normSAlt.map((alt) => {
    alt['prefScore'] = alt['product'] / normSAltProductSum
    return alt
  })

  // console.log(normSAlt)
  // console.log(normSAltProductSum)
  // console.log(altRank)

  const altIdRankSorted = altRank.sort((a, b) => b.prefScore - a.prefScore).map(alt => ({ id: alt.id, score: alt.prefScore }))
  return NextResponse.json({ data: altIdRankSorted })
}