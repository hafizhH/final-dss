import { NextResponse } from "next/server"
import fs from 'fs'
import path from "path"
import { csvStringToArray } from "@/app/utils"

export async function GET() {
  const fileBuffer = fs.readFileSync(path.join(process.cwd(), '/src/app/data/dataset.csv'))
  const rawData = csvStringToArray(fileBuffer.toString('utf-8'))
  const dataset = []
  for (const [index, row] of rawData.entries()) {
    if (index == 0)
      continue
    dataset.push({
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
  return NextResponse.json({ data: dataset })
}