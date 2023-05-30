import { NextResponse } from "next/server"
import fs from 'fs'
import path from 'path'
import { csvStringToArray } from "@/app/utils"

export async function POST(request) {
  
  const { alternativeIds, criterias } = request.body

  const fileBuffer = fs.readFileSync(path.resolve('@/app/data/dataset.csv'))
  rawData = csvStringToArray(fileBuffer.toString('utf-8'))
  const alternatives = []
  
  for (const [index, row] of rawData.entries()) {
    if (index == 0 || !alternativeIds.includes(row[0]))
      continue
    alternatives.push({
      id: row[0],
      nama: row[1],
      luas: row[2],
      harga: row[3],
      lebar: row[4],
      kota: row[5],
      pendidikan: row[6],
      kesehatan: row[7],
      perbelanjaan: row[8],
      kerja: 0,
      lokasi: {
        lat: row[9],
        long: row[10]
      },
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
    acc['sumKerja'] = acc['sumKerja'] ? acc['sumKerja'] + a.kerja : a.kerja
    return acc
  }, {})

  const cSum = criterias.reduce((acc, a) => acc + a, 0)
  const normCriterias = []
  for (const c of criterias) {
    normCriterias.push(c / cSum)
  }

  normSAlt = []
  for (const [index, alt] of alternatives.entries()) {
    alt.luas = Math.pow((alt.luas / altSum.sumLuas), normCriterias[0])
    alt.harga = Math.pow((alt.harga / altSum.sumHarga), normCriterias[1])
    alt.lebar = Math.pow((alt.lebar / altSum.sumLebar), normCriterias[2])
    alt.kota = Math.pow((alt.kota / altSum.sumKota), normCriterias[3])
    alt.pendidikan = Math.pow((alt.pendidikan / altSum.sumPendidikan), normCriterias[4])
    alt.kesehatan = Math.pow((alt.kesehatan / altSum.sumKesehatan), normCriterias[5])
    alt.perbelanjaan = Math.pow((alt.perbelanjaan / altSum.sumPerbelanjaan), normCriterias[6])
    alt.kerja = Math.pow((alt.kerja / altSum.sumKerja), normCriterias[7])
    alt['product'] = alt.luas * alt.harga * alt.lebar * alt.kota * alt.pendidikan * alt.kesehatan * alt.perbelanjaan * alt.kerja
    normSAlt.push(alt)
  }

  const normSAltProductSum = normSAlt.reduce((acc, a) => acc + a.product, 0)

  const altRank = normSAlt.map((alt, index) => {
    alt['rank'] = alt['product'] / normSAltProductSum
    return alt
  })

  const altRankSorted = altRank.sort((a, b) => a.rank - b.rank)
  return NextResponse.json({ data: altRankSorted })
}