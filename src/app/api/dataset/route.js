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
      nama: row[0],
      luas: row[1],
      harga: row[2],
      lebar: row[3],
      kota: row[4],
      pendidikan: row[5],
      kesehatan: row[6],
      perbelanjaan: row[7],
      kerja: 0,
      lokasi: {
        lat: row[8],
        long: row[9]
      },
      urlFoto: row[10],
    })
  }
  return NextResponse.json({ data: dataset })
}